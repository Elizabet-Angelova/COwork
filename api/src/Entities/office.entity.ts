import { PrimaryGeneratedColumn, Column, Entity, OneToOne, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Row } from "./row.entity";
import { User } from "./user.entity";
import { Project } from "./project.entity";

@Entity('office')
export class Office {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({unique: true, type: 'nvarchar'})
    country: string;

    @Column()
    desks: number;

    @OneToMany(type => Row, row => row.office)
    @JoinColumn()
    rows: Row[];

    @OneToMany(() => User, user => user.office)
    users: User[]; 

    @OneToMany(() => Project, project => project.id)
    projects: Project[];
}