import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "src/Entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { responseMessage } from "src/Enums/response-message";
import { TransformerService } from "./transformer.service";
import { Project } from "src/Entities/project.entity";
import { ProjectDTO } from "src/DTOs/projectDTO";
import { CreateProjectDTO } from "src/DTOs/createProjectDTO";
import { UserDTO } from "src/DTOs/userDTO";
import { Office } from "src/Entities/office.entity";





@Injectable()
export class ProjectService {

    constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Office) private readonly officeRepository: Repository<Office>,
        private readonly transformer: TransformerService,
    ) {
    }


    public async allProjects(): Promise<ProjectDTO[]> {
        return (await this.projectRepository.find({
            where: { isDeleted: false },
            relations: ['office', 'workers']
        }))
            .map(u => this.transformer.toProjectDTO(u));
    }

    public async createProject(projectInfo: CreateProjectDTO): Promise<responseMessage> {
        const name = projectInfo.name;
        const office = await this.officeRepository.findOne({where: {country: projectInfo.office}});
        const start = projectInfo.startDate;
        const end = projectInfo.endDate;
        const project = { ...new Project, office: office, name, startDate: start, endDate: end }
        await this.projectRepository.save(project)
        return responseMessage['9']
    }

    public async findProjectById(id: number): Promise<ProjectDTO> {
        const foundProject = await this.projectRepository.findOne({
            where: {
                id,
                isDeleted: false,
            },
            relations: ['office', 'workers'],
        });
        if (foundProject === undefined || foundProject.isDeleted) {
            throw new NotFoundException('Invalid Project ID!');
        }
        return this.transformer.toProjectDTO(foundProject);
    }


    public async findProjectByName(searchString: string): Promise<ProjectDTO[]> {
        if (searchString) {
            const allProjects = await this.allProjects()
            const foundProjects: ProjectDTO[] = allProjects.filter(project =>
                project.name.toLowerCase().includes(searchString.toLowerCase()));
            return foundProjects;
        } else {
            throw new NotFoundException('Invalid search parameter!');
        }

    }

    async deleteProject(projectId: number): Promise<responseMessage> {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ['office', 'workers'],
        })


        project.isDeleted = true;
        await this.projectRepository.save(project);

        return responseMessage['10']
    }


    async recoverProject(projectId: number): Promise<{ message: string }> {
        const project = await this.findOneOrFail(projectId);
        project.isDeleted = false;
        await this.projectRepository.save(project);
        return {
            message: 'Project has been recovered!',
        };
    }


    async findOneOrFail(projectId: number): Promise<Project> {
        const project = await this.projectRepository.findOne(projectId);
        if (!project) {
            throw new Error('No such project exists!')
        }
        return project;
    }


    async getUsersFromProject(projectId: number): Promise<UserDTO[]> {
        let users = await this.userRepository.find({where: {isDeleted: false}, relations: ['project']})
        let usersToReturn = users.filter(user => user.project.id === Number(projectId))
        return usersToReturn.map(user => this.transformer.toUserDTO(user))
    }

  
}


