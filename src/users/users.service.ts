import { Injectable ,NotFoundException, BadRequestException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService  {
  constructor(
    @InjectRepository(User) private userRepository : Repository<User>
  ){
    
  }
  
  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number, requestUserEmail : string) {
    const user = await this.userRepository.findOne({where:{id}});
    if(!user) throw new NotFoundException("User Not found");
    const requestUser = await this.findByUserEmail(requestUserEmail);
    const isMe = requestUser.id === user.id;
    if(isMe) return {
      email : user.email,
      firstname: user.firstname,
      lastname : user.lastname,
      profile_img_url : user.profile_img_url
    }
    return {
      firstname: user.firstname,
      lastname : user.lastname,
      profile_img_url : user.profile_img_url
    };
  }

  findByUserEmail(email: string){
    try {
      return this.userRepository.findOne({where:{email}});
    } catch (error) {
      throw new Error("DB Error");
    }

  }

  findByUserId(id: number){
    try {
      return this.userRepository.findOne({where:{id}});
    } catch (error) {
      throw new Error("DB Error");
    }

  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.userRepository.softDelete({id});
  }

  async verifyUser(id: string, requestUserEmail : string){
    const user = await this.findByUserEmail(requestUserEmail);
    
    if(!user || user.id !==parseInt(id)) throw new BadRequestException("You don't have right to update/delete user");
    return true;
  }
}
