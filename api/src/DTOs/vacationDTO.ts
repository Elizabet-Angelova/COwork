import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/Entities/user.entity";
import { VacationStatus } from "src/Enums/vacation-status";

export class VacationDTO {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    startDate: string;
    

    @IsString()
    @IsNotEmpty()
    endDate: string;

    user: User;

    status: VacationStatus;

}