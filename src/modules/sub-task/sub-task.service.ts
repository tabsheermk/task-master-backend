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

  async create(data: CreateSubTask): Promise<SubTask> {
    this.logger.info('Creating a sub task');
    const subTask = this.subTaskRepository.create({
      ...data,
      status: TaskStatus.TODO,
    });
    return await this.subTaskRepository.save(subTask);
  }

  async update(id: string, data: UpdateSubTask): Promise<SubTask> {
    this.logger.info({ subTaskId: id }, 'Updating a task');

    const subTask = await this.subTaskRepository.findOneBy({ id });

    if (!subTask) {
      this.logger.warn({ subTaskId: id }, 'Subtask not found');
      throw new NotFoundException('Subtask not found');
    }

    Object.assign(subTask, data);

    const updatedSubTask = await this.subTaskRepository.save(subTask);

    this.logger.info({ subTaskId: id }, 'SubTask updated');

    return updatedSubTask;
  }

  async find(): Promise<SubTask[]> {
    this.logger.info('fetch all SubTasks');
    const subTasks = await this.subTaskRepository.find();
    return subTasks;
  }

  async findOne(id: string): Promise<SubTask> {
    this.logger.info({ subTaskId: id }, 'Fetching a subtask');
    const subTask = await this.subTaskRepository.findOneBy({ id });

    if (!subTask) {
      this.logger.info({ subTaskId: id }, 'SubTask not found');
      throw new NotFoundException(`SubTask ${id} not found`);
    }

    return subTask;
  }
}
