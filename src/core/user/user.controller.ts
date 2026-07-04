import { Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject()
    private userService: UserService,
  ) {}

  @Post()
  async create(user: CreateUser) {
    const data = await this.userService.create(user);
    return {
      data,
      message: 'User created successfully',
    };
  }

  @Get('/:email')
  async getByEmail(@Param('email') email: string) {
    const data = await this.userService.findByEmail(email);
    return {
      data,
      message: 'User with email fetched',
    };
  }

  @Get('/:username')
  async getByUsername(@Param('username') username: string) {
    const data = await this.userService.findByUsername(username);
    return {
      data,
      message: 'User with usrname fectched',
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
