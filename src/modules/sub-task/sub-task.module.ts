import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubTask } from './entities/sub-task.entity';
import { SubTaskController } from './sub-task.controller';
import { SubTaskService } from './sub-task.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubTask])],
  controllers: [SubTaskController],
  providers: [SubTaskService],
})
export class SubTaskModule {}
