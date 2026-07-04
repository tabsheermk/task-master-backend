import { Controller, Delete, Get, Inject, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    @Inject()
    private userService: UserService,
  ) {}

  @Get('/by-email/:email')
  async getByEmail(@Param('email') email: string) {
    const data = await this.userService.findByEmail(email);
    return {
      data,
      message: 'User with email fetched',
    };
  }

  @Get('/by-username/:username')
  async getByUsername(@Param('username') username: string) {
    const data = await this.userService.findByUsername(username);
    return {
      data,
      message: 'User with usrname fectched',
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findOne(id);
    return {
      data,
      message: 'User data fetched',
    };
  }

  @Get()
  async getAll() {
    const data = await this.userService.findAll();
    return {
      data,
      count: data.length,
      message: 'users fetched successfully',
    };
  }

  @Delete('/:id')
  async delete(@Param('id') id: string) {
    await this.userService.remove(id);
  }
}
