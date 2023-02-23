import { Controller, Post, Get, Body, Param, Req ,UseGuards, Logger} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    
    ) {}
    private readonly logger = new Logger(AuthController.name)
  
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    this.logger.verbose("/POST user/signup executed");
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() authDto: AuthDto) {
    this.logger.verbose("/POST user/signin executed");
    return this.authService.signIn(authDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req : Request) {
    this.logger.verbose("/GET user/logout executed");
    return this.authService.logout(req.user['id']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req : Request){
    this.logger.verbose("/GET user/refresh executed");
    const userId= req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }
}
