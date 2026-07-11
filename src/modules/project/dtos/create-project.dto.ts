import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProject {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  organizationId: string;
}
