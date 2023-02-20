import { Controller, Post, Get, Patch, Put, Delete,Body ,Param,ParseIntPipe,Req,UseGuards} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ClassService } from './class.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { CreateSpaceDto } from './dto/create-space.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {
  }
  
  // space 
  @UseGuards(AccessTokenGuard)
  @Post()
  createSpace(@Body() createSpaceDto: CreateSpaceDto,@Req() req:Request){
    const userId = req.user['id'];
    return this.classService.createSpace(createSpaceDto,userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id/join')
  joinSpace(@Param('id',ParseIntPipe) spaceId : number,@Body() verifyCodeDto : VerifyCodeDto, @Req() req:Request){
      const userId = req.user['id'];
      const {verifyCode} = verifyCodeDto;
      return this.classService.joinSpace(userId, spaceId, verifyCode);
  }



  // space - role
  @Post(":id/space-role")
  createSpaceRole(@Param('id',ParseIntPipe) spaceId : number, @Body() createSpaceRoleDto : CreateSpaceRoleDto){
    return this.classService.createSpaceRole(spaceId,createSpaceRoleDto );
  }

  
}
