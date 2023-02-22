import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Base } from "./base.entity";

Entity("reply")
export class Reply extends Base{
    @Column()
    content : string;

    @Column()
    userId : number;

    @Column()
    child : Reply[];

    @Column()
    parent : Reply;

    
}