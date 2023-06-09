import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Base } from "./base.entity";
import { Posts } from "./post.entity";
import { Reply } from "./reply.entity";
import { User } from "./user.entity";

@Entity("chat")
export class Chat extends Base{
    @Column()
    content: string;

    @Column()
    isAnonymous : boolean;

    @Column()
    userId : number;

    @Column("simple-array")
    child : string[];

    @ManyToOne(()=>Posts,(posts)=>posts.chats)
    post : Posts;

    @OneToMany(()=>Reply,(reply)=>reply.chat,{nullable : true})
    reply : Reply[];
}