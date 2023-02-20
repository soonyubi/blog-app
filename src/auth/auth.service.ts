import { Injectable,Inject, BadRequestException } from '@nestjs/common';
import * as argon2 from "argon2";
import { UsersService } from 'src/users/users.service';
import {JwtService} from "@nestjs/jwt";
import {ConfigService,ConfigType} from "@nestjs/config";
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import authConfig from 'src/config/env/authConfig';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService : JwtService,
        private configService : ConfigService,
        @Inject(authConfig.KEY) private config : ConfigType<typeof authConfig>
    ){}

    async signUp(createUserDto : CreateUserDto) : Promise<any>{
        const userExists = await this.usersService.findByUserEmail(createUserDto.email);
        if(userExists) throw new BadRequestException('User already exists');

        const hashedPassword = await this.hashData(createUserDto.password);
        createUserDto.password = hashedPassword;
        const newUser = await this.usersService.create(createUserDto);
        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshToken(newUser.id, newUser.refreshToken);
        return tokens;
    }

    async signIn(authDto : AuthDto) {
        const user = await this.usersService.findByUserEmail(authDto.email);
        if(!user) throw new BadRequestException("User doens not exist");
        const passwordMatches = await argon2.verify(user.password, authDto.password);
        if(!passwordMatches) throw new BadRequestException("Password is incorrect");

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(id : number){
        await this.usersService.update(id,{refreshToken:null});
    }

    hashData(data: string){return argon2.hash(data);}

    async updateRefreshToken(id : number, refreshToken : string){
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.usersService.update(id, {refreshToken : hashedRefreshToken});
    }

    async getTokens(id:number, email : string){
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {  
                    id,
                    email
                },
                {
                    secret : this.config.jwt_access_secret,
                    expiresIn : '1h'
                }
            ),
            this.jwtService.signAsync(
                {  
                    id,
                    email
                },
                {
                    secret : this.config.jwt_refresh_secret,
                    expiresIn : '30d'
                }
            ),
        ]);

        return {accessToken, refreshToken};
    }
}
