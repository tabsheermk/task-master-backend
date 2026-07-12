import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from './entities/epic.entity';
import { EpicController } from './epic.controller';
import { EpicService } from './epic.service';

@Module({
  imports: [TypeOrmModule.forFeature([Epic])],
  controllers: [EpicController],
  providers: [EpicService],
})
export class EpicModule {}
