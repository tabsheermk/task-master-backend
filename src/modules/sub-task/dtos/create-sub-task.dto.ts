import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubTask {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  assigneeId: string;
}
