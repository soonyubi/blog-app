import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from './config/env/validationSchema';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import authConfig from './config/env/authConfig';
import { Space } from './entities/space.entity';
import { SpaceRole } from './entities/spaceRole.entity';
import { Take } from './entities/take.entity';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load : [authConfig],
      isGlobal : true,
      validationSchema
    }),
    TypeOrmModule.forRoot({
    type :'mysql',
    host : process.env.DATABASE_HOST,
    port : parseInt(process.env.DATABASE_PORT,10),
    username : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME,
    entities : [User, Space,SpaceRole, Take ],
    synchronize : process.env.DATABASE_SYNCHRONIZE==='true'
  }),
    UsersModule,
    AuthModule,
    ClassModule,
    PostModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
