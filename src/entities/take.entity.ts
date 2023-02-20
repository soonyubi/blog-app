import {Column, Entity, OneToOne,JoinColumn} from "typeorm";
import { Base } from "./base.entity";
import { SpaceRole } from "./spaceRole.entity";

@Entity('take')
export class Take extends Base{

    @Column()
    userId : number;

    @Column()
    spaceId : number;


    @OneToOne(()=>SpaceRole)
    @JoinColumn()
    role : SpaceRole
}