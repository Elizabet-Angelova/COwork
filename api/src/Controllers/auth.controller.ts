import { Controller, Post, Body, Delete, ValidationPipe, UseGuards, Put } from "@nestjs/common";
import { AuthService } from "src/Services/authentication.service";
import { UserLoginDTO } from "src/DTOs/userLoginDTO";
import { responseMessage } from "src/Enums/response-message";
import { GetToken } from "src/auth/get-token.decorator";


@Controller('session')

export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post()
    async login(@Body(new ValidationPipe({ whitelist: true })) userDto: UserLoginDTO): Promise<{ token: string }> {
        return await this.authService.login(userDto.emailOrUsername, userDto.password);
    }

    @Delete()
    async logout(@GetToken() token: string): Promise<responseMessage> {
        await this.authService.blacklist(token?.slice(7));

        return responseMessage['7'];
    }



}