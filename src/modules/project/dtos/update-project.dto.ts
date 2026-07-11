import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProject } from './create-project.dto';

export class UpdateProject extends PartialType(
  OmitType(CreateProject, ['organizationId'] as const),
) {}
