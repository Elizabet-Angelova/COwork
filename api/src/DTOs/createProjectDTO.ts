import { IsString, IsNotEmpty } from "class-validator";

export class CreateProjectDTO {
@IsString()
@IsNotEmpty( {
    message: 'Project name cannot be empty!'
})
    name: string;
    office: string;

    startDate : Date;
    endDate : Date;
}