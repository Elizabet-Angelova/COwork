import { Body, Controller, Get, Param, Post, Put, UseGuards, ValidationPipe } from "@nestjs/common";
import { BlacklistGuard } from "src/auth/blacklist.guard";
import { RolesGuard } from "src/Auth/roles.guard";
import { UserDecorator } from "src/Auth/user-id.decorator";
import { requestVacationDTO } from "src/DTOs/requestVacationDTO";
import { User } from "src/Entities/user.entity";
import { UserRole } from "src/Enums/user-role";
import { VacationService } from "src/Services/vacation.service";

@Controller('vacation')

export class VacationController {
    constructor(private readonly vacationService: VacationService) {}

    @Post()
    @UseGuards(BlacklistGuard)
    public async requestVacation(@Body(new ValidationPipe({whitelist: true})) body: requestVacationDTO, @UserDecorator() user: User ) {
        return await this.vacationService.requestVacation(body, user);
    }

    @Get()
    @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
    public async allVacations() {
        return await this.vacationService.allVacations();
    }

    @Get(':userId')
    @UseGuards(BlacklistGuard)
    public async allUserVacations(@Param('userId')userId: number) {
        return await this.vacationService.allUserVacations(userId);
    }


}