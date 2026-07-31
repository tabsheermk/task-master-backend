import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { TaskService } from './task.service';
import { PinoLogger } from 'nestjs-pino';
import { CreateTask } from './dtos/create-task.dto';
import { CurrentUser } from 'src/common/decorators/current-user';
import { User } from 'src/core/user/entities/user.entity';
import { UpdateTask } from './dtos/update-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(
    @Inject() private taskService: TaskService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TaskController.name);
  }

  @Post()
  async create(@Body() data: CreateTask, @CurrentUser() user: User) {
    this.logger.info('Creating a task');
    const res = await this.taskService.create(data, user);
    return {
      data: res,
      mesage: 'Task created successfully',
    };
  }

  @Put('/:id')
  async update(@Body() data: UpdateTask, @Param('id') id: string) {
    this.logger.info('Updating a task');
    const res = await this.taskService.update(id, data);
    return {
      data: res,
      message: 'Task updated successfully',
    };
  }

  @Get()
  async find() {
    this.logger.info('Fetchig all tasks');
    const res = await this.taskService.find();
    return {
      data: res,
      count: res.length,
      message: 'Tasks fetched succesfully',
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    this.logger.info('Fetching a task');
    const res = await this.taskService.findOne(id);
    return {
      data: res,
      message: 'Task fetched successfully',
    };
  }

  @Get('/project/:projectId')
  async getTasksOfAProject(@Param('projectId') projectId: string) {
    this.logger.info('Fetching tasks of a project');
    const res = await this.taskService.findTasksOfAProject(projectId);
    return {
      data: res,
      message: 'Tasks of a project fetched successfully',
    };
  }
}
