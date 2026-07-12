import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSubTask } from './create-sub-task.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from 'src/modules/task/entities/task.entity';

export class UpdateSubTask extends PartialType(
  OmitType(CreateSubTask, ['taskId'] as const),
) {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
