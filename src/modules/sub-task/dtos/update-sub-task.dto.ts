import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/modules/task/entities/task.entity';
import { CreateSubTask } from './create-sub-task.dto';

export class UpdateSubTask extends PartialType(CreateSubTask) {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
