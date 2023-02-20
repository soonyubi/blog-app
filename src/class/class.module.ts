import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import { Space } from 'src/entities/space.entity';
import { SpaceRole } from 'src/entities/spaceRole.entity';
import { Take } from 'src/entities/take.entity';
@Module({
  imports : [TypeOrmModule.forFeature([Space,SpaceRole,Take])],
  controllers: [ClassController],
  providers: [ClassService]
})
export class ClassModule {}
