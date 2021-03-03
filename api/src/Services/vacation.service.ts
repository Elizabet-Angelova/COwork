import { Injectable } from "@nestjs/common";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/Entities/user.entity";
import { Vacation } from "src/Entities/vacation.entity";
import { Repository } from "typeorm";
import * as moment from 'moment';
import { requestVacationDTO } from "src/DTOs/requestVacationDTO";
import { TransformerService } from "./transformer.service";
import { VacationDTO } from "src/DTOs/vacationDTO";
import { UserDTO } from "src/DTOs/userDTO";
import { Cron, CronExpression } from "@nestjs/schedule";
import { VacationStatus } from "src/Enums/vacation-status";



@Injectable()
export class VacationService {

    constructor(@InjectRepository(Vacation) private readonly vacationRepository: Repository<Vacation>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly transformer: TransformerService,
    ) {}
     validateVacationRequest(request: requestVacationDTO, user: User): boolean {
        const startDate = moment(request.startDate, 'YYYY-MM-DD');
        const endDate = moment(request.endDate, 'YYYY-MM-DD');
        const diff = endDate.diff(startDate, 'days');
        return diff >= 0 && diff < user.maxVacation;
    }

    async requestVacation(request: requestVacationDTO, user: User): Promise<string> {
        if (!user) {
            return 'Invalid user';
        }
        const validator = this.validateVacationRequest(request, user);
        if (validator) {
            const vacation = { ...request, startDate: request.startDate, endDate: request.endDate, user: user };
            await this.vacationRepository.save(vacation);
            return `Vacation request for user ${user.username} has been submitted from ${vacation.startDate} to ${vacation.endDate}.`
        } else {
            return `Invalid vacation period! Your max vacation is ${user.maxVacation} days!`;
        }
    }

    async allVacations(): Promise<Vacation[] | string> {
        if (!this.vacationRepository) {
            return 'No vacations to show!';
        }
        return (await this.vacationRepository.find({
            relations: ['user']
        })).map((v) => this.transformer.toVacationDTO(v));

    }

    async allUserVacations(userId: number): Promise<VacationDTO[]|string> {
        const vacations = await this.vacationRepository.find( {
            where: {
                user: userId,
            }
        });
        if(vacations) {
            return vacations;
        }
        return 'User has no vacations!';
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async userOnVacation() {
        let users = await this.userRepository.find({relations: ['vacation']})
        users.forEach(user => {
        const today = moment();
        const vacations = user.vacation.filter(vacation => vacation.status === VacationStatus.Approved)
        if (vacations.length > 0){
        vacations.map(vacation => {
            const startDate = vacation.startDate;
            const endDate = vacation.endDate;
            if (today.isBetween(startDate, endDate)) {
                user.isOnVacation = true;
                this.userRepository.save(user);
            } else {
                user.isOnVacation = false;
                this.userRepository.save(user);
            }
        });
    }
})
    }
}
