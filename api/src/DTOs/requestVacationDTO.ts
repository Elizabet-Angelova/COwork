import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/Entities/user.entity";

export class requestVacationDTO {
    @IsString()
    @IsNotEmpty()
    
    startDate: string;
    @IsString()
    @IsNotEmpty()
    
    endDate: string;

    user: User;
}