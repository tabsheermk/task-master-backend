import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateComment } from './create-comment.dto';

export class UpdateComment extends PartialType(
  OmitType(CreateComment, ['taskId'] as const),
) {}
