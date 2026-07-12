import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTask } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class UpdateTask extends PartialType(
  OmitType(CreateTask, ['projectId'] as const),
) {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}
