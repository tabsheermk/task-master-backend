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
import { PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { SubTaskService } from './sub-task.service';
import { CreateSubTask } from './dtos/create-sub-task.dto';
import { UpdateSubTask } from './dtos/update-sub-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks/:taskId/subtasks')
export class SubTaskController {
  constructor(
    @Inject() private subTaskService: SubTaskService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SubTaskController.name);
  }

  @Post()
  async create(@Body() data: CreateSubTask) {
    this.logger.info('Creating a subtask');
    const res = await this.subTaskService.create(data);
    return {
      data: res,
      message: 'SubTask created successfully',
    };
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateSubTask) {
    this.logger.info('Updating a SubTask');
    const res = await this.subTaskService.update(id, data);
    return {
      data: res,
      message: 'SubTask updated successfully',
    };
  }

  @Get()
  async find() {
    this.logger.info('Fetching all subtasks');
    const res = await this.subTaskService.find();
    return {
      data: res,
      count: res.length,
      message: 'SubTasks fetched successfully',
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    this.logger.info('Fetching a subtask');
    const res = await this.subTaskService.findOne(id);
    return {
      data: res,
      message: 'Subtask fetched succesffully',
    };
  }
}
