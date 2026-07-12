import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubTask {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  taskId: string;

  @IsOptional()
  @IsString()
  assigneeId: string;
}
