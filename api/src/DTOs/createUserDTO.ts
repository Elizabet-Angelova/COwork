import { MinLength, IsNotEmpty, IsString, IsNumber} from "class-validator";
import { WorksFrom } from "src/Enums/works-from";


export class CreateUserDTO {
    @IsString()
    @IsNotEmpty( {
        message: "Your username cannot be empty!"
    })
   username: string;

   @IsString()
    @IsNotEmpty( {
        message: "Your name cannot be empty!"
    })
   fullName: string;

    @IsString()
    @IsNotEmpty( {
        message: "Email field cannot be empty!"
    })
   email: string;

    @IsString()
    @IsNotEmpty( {
        message: "Password cannot be empty!"
    })
    @MinLength(5, {
        message: "Password is  too short, it must be atleast 5 symbols!"
    }) //min length
    password: string;

    
    role? : string;


    worksFrom?: WorksFrom;

    @IsNotEmpty( {
        message: "Country field cannot be empty!"
    })
   office: string;

}