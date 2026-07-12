import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateEpic } from './create-epic.dto';
import { EpicStatus } from '../entities/epic.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateEpic extends PartialType(
  OmitType(CreateEpic, ['projectId'] as const),
) {
  @IsOptional()
  @IsEnum(EpicStatus)
  status?: EpicStatus;
}
