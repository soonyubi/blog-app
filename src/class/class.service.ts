import { Injectable, BadRequestException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Space } from 'src/entities/space.entity';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceRole } from 'src/entities/spaceRole.entity';

@Injectable()
export class ClassService {
    constructor(
        @InjectRepository(Space) private spaceRepository : Repository<Space>,
        @InjectRepository(SpaceRole) private spaceRoleRepository : Repository<SpaceRole>
    ){}
    async createSpace(createSpaceDto : CreateSpaceDto, userId : number){
        const admin_verify_code = this.getVerifyCode();
        const participant_verify_code = this.getVerifyCode();
        const result = await this.spaceRepository.save({
            ...createSpaceDto,
            admin_verify_code,
            participant_verify_code,
            isOpendByUser : userId
        });
        return result;
    }

    async createSpaceRole(id : number, createSpaceRoleDto : CreateSpaceRoleDto){
        let space = await this.spaceRepository.findOne(id,{
            relations : ['spaceRoles']
        });
        
        if(!space) throw new BadRequestException("Invalid space id");
        const {admin, participant} = createSpaceRoleDto;
        //create admin space-role 
        for(let i =0; i< admin.length; i++){ 
            console.log(admin[i]);
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

    async joinSpace(userId : number, spaceId:number, verifyCode : string){

    }

    getSpaceById(id : number){
        return this.spaceRepository.findOne({where:{id}});
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
