import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUser {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
