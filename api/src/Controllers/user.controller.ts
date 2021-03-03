import { UserService } from "src/Services/user.service";
import { Controller, Get, Param, Post, Delete, Body, Put, ValidationPipe, UseGuards, ParseIntPipe } from "@nestjs/common";
import { UserDTO } from "src/DTOs/userDTO";
import { responseMessage } from "src/Enums/response-message";
import { CreateUserDTO } from "src/DTOs/createUserDTO";
import { BlacklistGuard } from "src/auth/blacklist.guard";



@Controller('users')

export class UsersController {
    constructor(private readonly usersService: UserService,) { }

    @Get() 
    @UseGuards(BlacklistGuard)
    public async getAllUsers(): Promise<UserDTO[]> {
        return this.usersService.allUsers();
    }

    @Get(':id')
    @UseGuards(BlacklistGuard)
    public async findOne(@Param('id') id: number): Promise<UserDTO> {
        return await this.usersService.findUserById(id);
    }

    @Get('/name/:name')
    @UseGuards(BlacklistGuard)
    public async findOneByName(@Param('name') name: string): Promise<UserDTO[]> {
            return await this.usersService.findUserByName(name);
    }

    @Get('/email/:email')
    @UseGuards(BlacklistGuard)
    public async findOneByEmail(@Param('email') email: string): Promise<UserDTO[]> {
            return await this.usersService.findUserByEmail(email);
    }

    @Delete(':id')
    @UseGuards(BlacklistGuard)
    public async delede(@Param('id') id: number) {
            return await this.usersService.deleteUser(id);
    }

    @Post()
    public async createUser(@Body(new ValidationPipe({ whitelist: true })) body: CreateUserDTO): Promise<responseMessage> {
        return await this.usersService.createUser(body);
    }

    @Get('/office/:id')
    @UseGuards(BlacklistGuard)
    public async userOffice(@Param('id') userId: number): Promise<Object> {
        return await this.usersService.userOffice(userId);
    }
}