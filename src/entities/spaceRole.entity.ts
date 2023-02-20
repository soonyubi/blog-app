import {Column, Entity, ManyToOne} from "typeorm";
import { Base } from "./base.entity";
import { Space } from "./space.entity";

@Entity('spaceRole')
export class SpaceRole extends Base{
    
    @Column()
    isAdmin : boolean;

    @Column()
    rolename : string;

    @ManyToOne(()=>Space,(space)=>space.spaceRoles)
    space : Space;
}