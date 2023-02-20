import {CreateDateColumn, DeleteDateColumn, UpdateDateColumn, PrimaryGeneratedColumn} from "typeorm"

export abstract class Base{
    @PrimaryGeneratedColumn()
    id : number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}