import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne} from "typeorm";
import { Base } from "./base.entity";
import { Chat } from "./chat.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

@Entity('post')
export class Posts extends Base{
    @Column()
    title : string;

    @Column()
    description: string;

    @Column()
    files : string;

    @Column()
    isNotification : boolean;

    @Column()
    isAdmin : boolean;

    @Column()
    isAnonymous : boolean;

    @Column()
    userId : number;

    @ManyToOne(()=>Space,(space)=>space.posts)
    // @JoinColumn()
    space : Space;

    @OneToMany(()=>Chat, (chats)=>chats.post)
    chats : Chat
}