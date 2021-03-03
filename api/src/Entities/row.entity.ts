import { PrimaryGeneratedColumn, Column, Entity, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Square } from './square.entity'
import { Office } from './office.entity'

@Entity('row')
export class Row {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    rowNumber: number;

    @OneToMany(type => Square, square => square.row)
    squares: Square[];

    @ManyToOne(type => Office, office => office.rows)
    office: Office
}