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

  // this method is for testing
  // @Get(":id")
  // getSpaceById(@Param('id',ParseIntPipe) spaceId : number){
  //   return this.classService.findById(spaceId);
  // }
  // create space
  @UseGuards(AccessTokenGuard)
  @Post()
  createSpace(@Body() createSpaceDto: CreateSpaceDto,@Req() req:Request){
    const userId = req.user['id'];
    return this.classService.createSpace(createSpaceDto,userId);
  }

  // join space
  @UseGuards(AccessTokenGuard)
  @Post(':id/join')
  joinSpace(@Param('id',ParseIntPipe) spaceId : number,@Req() req:Request,@Body('id') spaceRoleId : number){
      const userId = req.user['id'];
      return this.classService.joinSpace(userId, spaceId, spaceRoleId);
  }

  // delete space
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  deleteSpace(@Param('id') spaceId : number, @Req() req: Request){
    const userId = req.user['id'];
    return this.classService.deleteSpace(userId, spaceId);
  }


  // space - role
  @UseGuards(AccessTokenGuard)
  @Get(':id/space-role')
  getSpaceRole(@Param('id',ParseIntPipe) spaceId : number,@Body() verifyCodeDto : VerifyCodeDto){
      const {verifyCode} = verifyCodeDto;
      return this.classService.getSpaceRole(spaceId, verifyCode.trim());
  }

  @UseGuards(AccessTokenGuard)
  @Post(":id/space-role")
  createSpaceRole(@Param('id',ParseIntPipe) spaceId : number, @Body() spaceRoleDto : CreateSpaceRoleDto, @Req() req: Request){
    // TODO : 개설자만 role을 생성할 수 있도록 수정
    const userId = req.user['id'];
    return this.classService.createSpaceRole(userId, spaceId,spaceRoleDto );
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id/space-role')
  deleteSpaceRole(@Param('id',ParseIntPipe) spaceId: number, @Body('id') spaceRoleId : number, @Req() req: Request){
    const userId = req.user['id'];
    return this.classService.deleteSpaceRole(userId, spaceId, spaceRoleId);
  }
}
