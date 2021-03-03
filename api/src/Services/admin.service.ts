import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from 'moment'
import { AddWorkerDTO } from "src/DTOs/addWorkerDTO";
import { Project } from "src/Entities/project.entity";
import { User } from "src/Entities/user.entity";
import { Vacation } from "src/Entities/vacation.entity";
import { responseMessage } from "src/Enums/response-message";
import { Repository } from "typeorm";

@Injectable()
export class AdminService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(Vacation) private readonly vacationRepository: Repository<Vacation>
  ) { }

  async deleteUser(userId: number): Promise<responseMessage> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    user.isDeleted = true;
    await this.userRepository.save(user);
    return responseMessage['8']
  }

  async setUserVacation(userId: number, newMaxVacation: number) {
    let user = await this.userRepository.findOne({ where: { id: userId, isDeleted: false } })
    if (!user) {
      return 'User not found!'
    }
    user.maxVacation = newMaxVacation;
    this.userRepository.save(user);
    return `Vacation for user ${user.username} has been set to ${user.maxVacation} days!`;
  }


  async addWorkerToProject(projectId: number, user: AddWorkerDTO): Promise<responseMessage> {
    let project = await this.projectRepository.findOne({
      where: {
        id: projectId,
        isDeleted: false,
      }
    });

    let worker = await this.userRepository.findOne({
      where: {
        fullName: user.id,
        isDeleted: false
      }
    });
    if (worker && project) {
      worker = { ...worker, project: project, rang: user.rang }
      await this.userRepository.save(worker)
    } else {
      return responseMessage['5'];
    }
    return responseMessage['11'];
  };



  async removeWorkerFromProject(projectId: number, user: AddWorkerDTO): Promise<responseMessage> {
    let project = await this.projectRepository.findOne({
      where: {
        id: projectId,
        isDeleted: false,
      }
    });

    let worker = await this.userRepository.findOne({
      where: {
        id: user.id,
        isDeleted: false
      }
    });
    if (user && project) {
      worker = { ...worker, project: null }
      await this.userRepository.save(worker)
    } else {
      return responseMessage['5'];
    }
    return responseMessage['12']
  }
  async recoverUser(userId: number): Promise<responseMessage> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isDeleted: true,
      }
    });
    user.isDeleted = false;
    await this.userRepository.save(user);
    return responseMessage['13'];
  }


  async declineUserVacation(userId: number, vacationId: number): Promise<responseMessage> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isDeleted: false,
      }
    });
    const vacation = await this.vacationRepository.findOne({
      where: {
        user: user,
        status: 2,
        id: vacationId,
      }
    });
    if (vacation && user) {
    vacation.status = 3;
    await this.vacationRepository.save(vacation);

    return responseMessage['14'];
    } else {
      return responseMessage['16'];
    }
  }


  async approveUserVacation(userId: number, vacationId: number): Promise<responseMessage> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isDeleted: false,
      }
    });
    const vacation = await this.vacationRepository.findOne({
      where: {
        id: vacationId,
        user: user,
        status: 2,
      }
    });
    if (vacation && user) {
      vacation.status = 1;
      await this.vacationRepository.save(vacation);
      const startDate = moment(vacation.startDate, 'YYYY-MM-DD');
      const endDate = moment(vacation.endDate, 'YYYY-MM-DD');
      const diff = endDate.diff(startDate, 'days');
      const newMaxVacation = user.maxVacation - diff;
      await this.setUserVacation(userId, newMaxVacation);
      await this.userRepository.save(user);
      return responseMessage['15'];
    } else {
      return responseMessage['16'];
    }

  }




}
