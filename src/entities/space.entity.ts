import {Column, Entity, OneToMany} from "typeorm";
import { Base } from "./base.entity";
import { SpaceRole } from "./spaceRole.entity";

@Entity('space')
export class Space extends Base{
    @Column()
    name : string;

    @Column()
    logo: string;

    @Column({length : 8})
    admin_verify_code : string;

    @Column({length : 8})
    participant_verify_code : string;

    @Column()
    owner : number;

    @OneToMany(()=>SpaceRole, (spaceRole)=>spaceRole.space)
    spaceRoles:SpaceRole[];
}