import { PrimaryGeneratedColumn, Column, Entity, OneToOne, ManyToOne, JoinColumn } from "typeorm";
import { Row } from "./row.entity";
import { User } from "./user.entity";

@Entity('square')
export class Square {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => Row, row => row.squares)
    @JoinColumn()
    row: Row;

    @Column()
    squareNumber: number;

    @Column({default: false})
    isDesk: boolean;

    @OneToOne(type => User, user => user.desk)
    user: User | null;

    @Column({default: false})
    forbidden: boolean;
}