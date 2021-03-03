import { Controller, Get, Param, Post, Delete, Body, Put, ValidationPipe, UseGuards, ParseIntPipe } from "@nestjs/common";
import { responseMessage } from "src/Enums/response-message";
import { BlacklistGuard } from "src/auth/blacklist.guard";
import { ProjectService } from "src/Services/project.service";
import { ProjectDTO } from "src/DTOs/projectDTO";
import { CreateProjectDTO } from "src/DTOs/createProjectDTO";
import { UserDTO } from "src/DTOs/userDTO";
import { RolesGuard } from "src/Auth/roles.guard";
import { UserRole } from "src/Enums/user-role";



@Controller('projects')

export class ProjectsController {
    constructor(private readonly projectService: ProjectService,) { }

    @Get()
    @UseGuards(BlacklistGuard)
    public async getAllProjects(): Promise<ProjectDTO[]> {
        return this.projectService.allProjects();
    }

    @Get(':id')
    @UseGuards(BlacklistGuard)
    public async findOne(@Param('id') id: number): Promise<ProjectDTO> {
        return await this.projectService.findProjectById(id);
    }

    @Get(':name')
    @UseGuards(BlacklistGuard)
    public async findOneByName(@Param('name') name: string): Promise<ProjectDTO[]> {
        return await this.projectService.findProjectByName(name);
    }

    @Get('/users/:projectId')
    @UseGuards(BlacklistGuard)
    public async getUsersFromProject(@Param('projectId') projectId: number): Promise<UserDTO[]> {
        return await this.projectService.getUsersFromProject(projectId);
    }

    @Post()
    @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
    public async createProject(@Body() body: CreateProjectDTO): Promise<responseMessage> {
        return await this.projectService.createProject(body);
    }

  

}