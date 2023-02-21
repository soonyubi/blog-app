import {Column, Entity, JoinColumn, OneToMany, OneToOne} from "typeorm";
import { Base } from "./base.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

@Entity('post')
export class Posts extends Base{
    @Column()
    name : string;

    @Column()
    logo: string;

    @Column({length : 8})
    admin_verify_code : string;

    @Column({length : 8})
    participant_verify_code : string;

    @OneToOne(()=>User)
    @JoinColumn()
    author : User;

    @OneToOne(()=>Space)
    @JoinColumn()
    space : Space;

}