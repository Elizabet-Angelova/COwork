import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity('record')
export class Record {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    date: string;
    
    @Column({type: 'nvarchar', default: 'no data'})
    countries: string;

    @Column({default: 0})
    globalCases: number;


}