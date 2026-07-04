import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUser {
  @IsNotEmpty()
  @IsString()
  organizationName: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
