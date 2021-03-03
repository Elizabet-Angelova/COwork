import { Body, Controller, Delete, Param, Post, Put, UseGuards } from "@nestjs/common";
import { BlacklistGuard } from "src/auth/blacklist.guard";
import { RolesGuard } from "src/Auth/roles.guard";
import { AddWorkerDTO } from "src/DTOs/addWorkerDTO";
import { responseMessage } from "src/Enums/response-message";
import { UserRole } from "src/Enums/user-role";
import { AdminService } from "src/Services/admin.service";

@Controller('admin')

export class AdminController {
    userService: any;
    constructor(
        private readonly adminService: AdminService,
    ) { }


    @Delete('/user/:id')
    @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
    async deleteUser(@Param('id') userId: string): Promise<responseMessage> {
        return await this.adminService.deleteUser(+userId);
    }

    @Put('/user/:id')
    @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
    public async recoverUser(@Param('id') userId: number): Promise<responseMessage> {
        return await this.adminService.recoverUser(userId);
    }

    @Put('/vacation/:userId')
    @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
    public async setUserVacation(@Param('userId') userId: number, @Body('newMaxVacation') newMaxVacation: number) {
        return await this.adminService.setUserVacation(userId, newMaxVacation);
    }


    @Put('/vacation/decline/:userId/:vacationId')
    @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
    public async declineUserVacation(@Param('userId')userId: number, @Param('vacationId')vacationId: number): Promise<responseMessage> {
        return await this.adminService.declineUserVacation(userId,vacationId);
    }

    @Put('/vacation/approve/:userId/:vacationId')
    @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
    public async approveUserVacation(@Param('userId')userId: number, @Param('vacationId')vacationId: number):Promise<responseMessage> {
        return await this.adminService.approveUserVacation(userId,vacationId);
    }


    @Post('/project/:projectId')
    @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
    public async addWorkerToProject(@Param('projectId') projectId: number, @Body() body: AddWorkerDTO): Promise<responseMessage> {
        return await this.adminService.addWorkerToProject(projectId, body);
    }

    @Put('/project/:projectId')
    @UseGuards(BlacklistGuard, new RolesGuard(UserRole.Admin))
    public async removeWorkerFromProject(@Param('projectId') projectId: number, @Body() body: AddWorkerDTO): Promise<responseMessage> {
        return await this.adminService.removeWorkerFromProject(projectId, body);
    }



}







