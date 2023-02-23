import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Base } from "./base.entity";
import { Chat } from "./chat.entity";
import { Posts } from "./post.entity";
import { User } from "./user.entity";

@Entity("reply")
export class Reply extends Base{
    @Column()
    content: string;

    @Column()
    isAnonymous : boolean;

    @Column()
    userId : number;

    @Column()
    parent: number;

    @Column("simple-array")
    child : string[];

    @ManyToOne(()=>Chat, (chat)=>chat.reply)
    chat : Chat;

}