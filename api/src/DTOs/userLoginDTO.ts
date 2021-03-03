import { IsString, IsNotEmpty } from "class-validator";

export class UserLoginDTO {
    @IsString()
    @IsNotEmpty( {
        message: "E-mail field cannot be empty!"
    })
    emailOrUsername: string;

    @IsString()
    @IsNotEmpty( {
        message: "Password cannot be empty!"
    })
    password: string;

}