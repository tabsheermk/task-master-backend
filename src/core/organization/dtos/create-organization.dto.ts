import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganization {
  @IsNotEmpty()
  @IsString()
  name: string;
}
