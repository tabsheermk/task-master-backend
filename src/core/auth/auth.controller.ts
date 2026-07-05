import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUser } from './dtos/register.dto';
import { LoginUser } from './dtos/login.dto';

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

  @Post('/login')
  async login(@Body() data: LoginUser) {
    const res = await this.authService.login(data);
    return {
      data: res,
      message: 'User logged in successfully',
    };
  }

  @Post('/refresh')
  async refresh(@Body() data: { refreshToken: string }) {
    const res = await this.authService.refresh(data.refreshToken);
    return {
      data: res,
      message: 'Token refresh successful',
    };
  }

  @Post('/logout')
  async logout(@Body() data: { refreshToken: string }) {
    await this.authService.logout(data.refreshToken);
    return {
      message: 'User logout successful',
    };
  }
}
