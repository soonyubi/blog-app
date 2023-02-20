import {Column, Entity} from "typeorm";
import { Base } from "./base.entity";

@Entity('user')
export class User extends Base{
    @Column()
    email : string;

    @Column()
    password: string;

    @Column({length : 30})
    firstname : string;

    @Column({length : 30})
    lastname : string;

    @Column({nullable : true, default : "s3-default-url"})
    profile_img_url : string;

    @Column({nullable : true})
    refreshToken : string;
}