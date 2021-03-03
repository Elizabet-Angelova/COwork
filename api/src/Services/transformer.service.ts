import { User } from "src/Entities/user.entity";
import { UserDTO } from "src/DTOs/userDTO";
import { Project } from "src/Entities/project.entity";
import { ProjectDTO } from "src/DTOs/projectDTO";
import { Vacation } from "src/Entities/vacation.entity";
import { VacationDTO } from "src/DTOs/vacationDTO";

export class TransformerService {

    toUserDTO(user: User): UserDTO {
        return {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            avatar: user.avatar,
            email: user.email,
            worksFrom: user.worksFrom,
            project: user.project ? user.project : null,
            office: user.office ? user.office : null,
            maxVacation: user.maxVacation,
            rang: user.rang,
            isOnVacation: user.isOnVacation,
        }
    }

    toProjectDTO(project: Project): ProjectDTO {
        return {
            id: project.id,
            name: project.name,
            isDeleted: project.isDeleted,
            workers: project.workers ? project.workers : null,
            office: project.office ? project.office : null,
            startDate: project.startDate ? project.startDate : null,
            endDate: project.endDate ? project.endDate : null,
        }
    }

    toVacationDTO(vacation: Vacation): VacationDTO {
        return {
            startDate: vacation.startDate,
            endDate: vacation.endDate,
            user: vacation.user,
            status: vacation.status,
            id: vacation.id,
        }
    }


}