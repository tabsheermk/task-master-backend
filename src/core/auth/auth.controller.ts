import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUser } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject()
    private authService: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() data: RegisterUser) {
    const res = await this.authService.register(data);
    return {
      data: res,
      messsage: 'User registered and org created successfully',
    };
  }
}
