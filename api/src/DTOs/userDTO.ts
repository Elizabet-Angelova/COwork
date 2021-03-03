import { IsNumber, IsNotEmpty, IsString } from "class-validator";
import { WorksFrom } from "src/Enums/works-from";
import { Office } from "src/Entities/office.entity";
import { Project } from "src/Entities/project.entity";

export class UserDTO {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    rang: string; 
    
    avatar?: string ;

    worksFrom: WorksFrom;

    project: Project | null;

    office: Office | null;

    maxVacation: number;

    isOnVacation: boolean;
}