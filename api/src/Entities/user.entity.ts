import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToMany, JoinTable, JoinColumn, ManyToOne } from "typeorm";
import { UserRole } from "src/Enums/user-role";
import { WorksFrom } from "src/Enums/works-from";
import { Office } from "./office.entity";
import { Project } from "./project.entity";
import { Square } from "./square.entity";
import { Vacation } from "./vacation.entity";


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({unique: true, type: 'nvarchar'}) 
    username: string;

    @Column({type: 'nvarchar'}) 
    email: string;

    @Column({ type: 'nvarchar', nullable: true}) 
    fullName: string;

    @Column({type: 'nvarchar'})
    password: string; 

    @Column({default: 'https://i.imgur.com/oinJZj8.png?2'})
    avatar?: string ;
    
    @Column({default: false})
    isDeleted: boolean; 

    @Column({default: false})
    isOnVacation: boolean; 

    @Column({default: 'Employee', type: 'nvarchar', nullable: true})
    rang: string; 

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.Basic,
    })
    role: UserRole;

    @Column({
        type: 'enum',
        enum: WorksFrom,
        default: WorksFrom.Office,
    })
    worksFrom: WorksFrom;

    @Column( {
        default: 20,
    })
    maxVacation: number;

    @ManyToOne(() => Office, office => office.users)
    @JoinColumn()
    office: Office | null;

    @OneToOne(() => Square, Square => Square.user)
    @JoinColumn()
    desk: Square | null;

    @ManyToOne(() => Project, project => project.workers)
    @JoinColumn()
    project: Project | null;

    @OneToMany(()=> Vacation, vacation => vacation.user)
    vacation: Vacation[];

}       

