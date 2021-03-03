import { IsNumber, IsArray, IsString } from "class-validator";
import { User } from "src/Entities/user.entity";
import { Office } from "src/Entities/office.entity";

export class ProjectDTO {
    @IsNumber()
    id: number;

    @IsString()
    name: string;

    isDeleted: boolean;

    workers: User[] | null;


    office: Office | null;

    startDate: Date | null;

    endDate: Date | null;
}