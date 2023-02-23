import { Controller, Get, Post,Logger, Body, Patch, Param, Delete , Req, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.verbose("/POST /users executed");
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    this.logger.verbose("/GET /users executed");
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req : Request) {
    this.logger.verbose("/GET /users/:id executed");
    return this.usersService.findOne(+id,req.user['email']);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto,  @Req() req : Request) {
    this.logger.verbose("/PATCH /users/:id executed");
    await this.usersService.verifyUser(id, req.user['email']);
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req : Request) {
    this.logger.verbose("/DELETE /users/:id executed");
    await this.usersService.verifyUser(id, req.user['email']);
    return this.usersService.remove(+id);
  }
}
