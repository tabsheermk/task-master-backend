import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubTask } from './entities/sub-task.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { CreateSubTask } from './dtos/create-sub-task.dto';
import { UpdateSubTask } from './dtos/update-sub-task.dto';
import { TaskStatus } from '../task/entities/task.entity';

@Injectable()
export class SubTaskService {
  constructor(
    @InjectRepository(SubTask) private subTaskRepository: Repository<SubTask>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SubTaskService.name);
  }

  async create(data: CreateSubTask, taskId: string): Promise<SubTask> {
    this.logger.info('Creating a sub task');
    const subTask = this.subTaskRepository.create({
      ...data,
      taskId: taskId,
      status: TaskStatus.TODO,
    });
    return await this.subTaskRepository.save(subTask);
  }

  async update(id: string, data: UpdateSubTask, taskId: string): Promise<SubTask> {
    this.logger.info({ subTaskId: id }, 'Updating a task');

    const subTask = await this.subTaskRepository.findOne({ where: { id, taskId } });

    if (!subTask) {
      this.logger.warn({ subTaskId: id, taskId }, 'Subtask not found');
      throw new NotFoundException('Subtask not found');
    }

    Object.assign(subTask, data);

    const updatedSubTask = await this.subTaskRepository.save(subTask);

    this.logger.info({ subTaskId: id }, 'SubTask updated');

    return updatedSubTask;
  }

  async find(taskId: string): Promise<SubTask[]> {
    this.logger.info({ taskId }, 'fetch all SubTasks');
    const subTasks = await this.subTaskRepository.find({ where: { taskId } });
    return subTasks;
  }

  async findOne(id: string, taskId: string): Promise<SubTask> {
    this.logger.info({ subTaskId: id }, 'Fetching a subtask');
    const subTask = await this.subTaskRepository.findOne({ where: { id, taskId } });

    if (!subTask) {
      this.logger.info({ subTaskId: id }, 'SubTask not found');
      throw new NotFoundException(`SubTask ${id} not found`);
    }

    return subTask;
  }
}
