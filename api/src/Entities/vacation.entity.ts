import { VacationStatus } from "src/Enums/vacation-status";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity('vacation')

export class Vacation {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: true})
    startDate: string;


    @Column({ nullable: true})
    endDate: string;

    @Column({
        type: 'enum',
        enum: VacationStatus,
        default : VacationStatus.Pending
    })
    status: VacationStatus;

    @ManyToOne(()=> User, user=>user.vacation)
    user: User;
    

}