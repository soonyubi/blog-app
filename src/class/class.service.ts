import { Injectable, BadRequestException , ForbiddenException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Space } from 'src/entities/space.entity';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceRole } from 'src/entities/spaceRole.entity';
import { Take } from 'src/entities/take.entity';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Space) private spaceRepository : Repository<Space>,
        @InjectRepository(SpaceRole) private spaceRoleRepository : Repository<SpaceRole>,
        @InjectRepository(Take) private takeRepository : Repository<Take>
    ){}

    /**
     *  Space service
     * 
    */
    async createSpace(createSpaceDto : CreateSpaceDto, userId : number){
        const admin_verify_code = this.getVerifyCode();
        const participant_verify_code = this.getVerifyCode();
        const result = await this.spaceRepository.save({
            ...createSpaceDto,
            admin_verify_code,
            participant_verify_code,
            owner : userId
        });
        return result;
    }

    async joinSpace(userId : number, spaceId : number, spaceRoleId: number){
        const spaceRole = await this.spaceRoleRepository.findOne({where:{id: spaceRoleId}});
        if(!spaceRole) throw new BadRequestException("Invalid space role id");
        const newTake = {
            userId, 
            spaceId,
            role : spaceRole
        }
        const take = await this.takeRepository.save(newTake);
        return take;
    }

    async getSpaceRole(spaceId:number, verifyCode : string){
        const space = await this.getSpaceById(spaceId);
        if(!space) throw new BadRequestException("Invalid space id");
        const roles = space.spaceRoles;
        let admin_roles = [];
        let participant_roles = [];
        for(var i =0;i<roles.length;i++){
            if(roles[i].isAdmin) admin_roles.push(roles[i]);
            else participant_roles.push(roles[i]);
        }
        if(space.admin_verify_code.toString() === verifyCode.toString()){
            return {admin_roles};
        }else if(space.participant_verify_code.toString() === verifyCode.toString()){
            return {participant_roles};
        }else{
            throw new BadRequestException("Invalid verify code");
        }
    }

    async deleteSpace(userId:number, spaceId : number){
        const space = await this.checkSpaceOwner(userId, spaceId);

        // 1. space 와 연관된 role 삭제
        await this.spaceRoleRepository.softDelete({space});
        // 2. space 삭제
        await this.spaceRepository.softDelete({id:spaceId});
        // 3. take 삭제 ( spaceId)
        await this.takeRepository.softDelete({spaceId});

        return "delete success!";
    }

    
    /**
     *  Space Role service
     * 
    */
    async createSpaceRole(userId : number, spaceId : number, createSpaceRoleDto : CreateSpaceRoleDto){
        const space = await this.checkSpaceOwner(userId,spaceId);
        const {admin, participant} = createSpaceRoleDto;
        //create admin space-role 
        for(let i =0; i< admin.length; i++){ 
            
            let newRole = await this.spaceRoleRepository.save({
                isAdmin : true,
                rolename : admin[i].toString()
            });
            space.spaceRoles.push(newRole);
        }
        // create participant space-role 
        for(let i =0; i< participant.length; i++){
            let newRole = await this.spaceRoleRepository.save({
                isAdmin : false,
                rolename : participant[i].toString()
            });
            space.spaceRoles.push(newRole);
        }
        
        return this.spaceRepository.save(space);
    }

    async deleteSpaceRole(userId : number, spaceId: number,spaceRoleId : number){
        
        const space = await this.checkSpaceOwner(userId, spaceId);
        const role = await this.spaceRoleRepository.findOne({where:{id:spaceRoleId}});
        const take = await this.takeRepository.find({spaceId:spaceId, role : role});
        
        if(take) throw new BadRequestException("Unable to delete because someone is in use.");

        const spaceRoleList = space.spaceRoles;
        let isDelete = false;

        spaceRoleList.map(item =>{
            if(item.id === spaceRoleId){
                const index = spaceRoleList.indexOf(item);
                spaceRoleList.splice(index,1);
                isDelete = true;
            }
        });
        await this.spaceRoleRepository.softDelete({id:spaceRoleId});
        space.spaceRoles= spaceRoleList;
        return this.spaceRepository.save(space);
    }

    /** 
     *  Helper function
     * 
    */
    async checkSpaceOwner(userId: number, spaceId :number){
        const space = await this.getSpaceById(spaceId);
        if(!space)throw new BadRequestException("Invalid space id");
        if(!userId || userId !== space.owner) throw new ForbiddenException("You are not owner of space");
        return space;
    }

    getSpaceById(id : number){
        return this.spaceRepository.findOne(id,{relations : ['spaceRoles']});

    } 
    getVerifyCode(){
        const characters = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        this.shuffle(characters);
        this.shuffle(numbers);
        let result = "";
        const charLength = characters.length;
        const numLength = numbers.length;
        let counter1 = 0;
        while(counter1<4){
            result += characters.charAt(Math.floor(Math.random()*charLength));
            counter1++;
        }
        let counter2 = 0;
        while(counter2<4){
            result += numbers.charAt(Math.floor(Math.random()*numLength));
            counter2++;
        }
        return result;
    }
    
    shuffle(text) {
        text.split('').sort(() => Math.random() - 0.5).join('');
    }
}
