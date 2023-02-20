import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from './config/env/validationSchema';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath : [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load : [],
      isGlobal : true,
      validationSchema
    }),
    TypeOrmModule.forRoot({
    type :'mysql',
    host : process.env.DATABASE_HOST,
    port : parseInt(process.env.DATABASE_PORT,10),
    username : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : 'classum',
    entities : [User],
    synchronize : process.env.DATABASE_SYNCHRONIZE==='true'
  }),
    UsersModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
