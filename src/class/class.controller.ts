import { Controller, Post, Get, Patch, Put, Delete,Body ,Param,ParseIntPipe} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { CreateSpaceDto } from './dto/create-space.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {
  }
  
  // space 
  @Post()
  createSpace(@Body() createSpaceDto: CreateSpaceDto){
    return this.classService.createSpace(createSpaceDto);
  }



  // space - role
  @Post(":id/space-role")
  createSpaceRole(@Param('id',ParseIntPipe) spaceId : number, @Body() createSpaceRoleDto : CreateSpaceRoleDto){
    return this.classService.createSpaceRole(spaceId,createSpaceRoleDto );
  }

  
}
