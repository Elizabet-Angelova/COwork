import { WorksFrom } from "src/Enums/works-from";
import { PrimaryGeneratedColumn, Column, Entity, OneToOne, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Office } from "./office.entity";
import { User } from "./user.entity";

@Entity('project')
export class Project {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({default: false})
    isDeleted: boolean;

    @Column({nullable: true})
    startDate: Date;

    @Column({nullable: true})
    endDate: Date;

    @Column({type: "nvarchar", unique: true})
    name: string;
    
    @ManyToOne(() => Office, office => office.projects)
    @JoinColumn()
    office: Office;

    @OneToMany(() => User, user => user.project)
    workers: User[];

    @Column({
        type: 'enum',
        enum: WorksFrom,
        default: WorksFrom.Office,
    })
    worksFrom: WorksFrom;

}