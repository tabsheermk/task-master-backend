import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskPriority, TaskStatus } from './entities/task.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { CreateTask } from './dtos/create-task.dto';
import { User } from 'src/core/user/entities/user.entity';
import { UpdateTask } from './dtos/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TaskService.name);
  }

  async create(data: CreateTask, user: User): Promise<Task> {
    this.logger.info({ epicId: data.epicId }, 'Creating a task');
    const task = this.taskRepository.create({
      ...data,
      reporterId: user.id,
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    });
    return await this.taskRepository.save(task);
  }

  async update(id: string, data: UpdateTask): Promise<Task> {
    this.logger.info({ taskId: id }, 'Updating a task');
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      this.logger.warn({ taskId: id }, 'Task not found');
      throw new NotFoundException(`Task ${id} not found`);
    }

    Object.assign(task, data);

    const updatedTask = await this.taskRepository.save(task);

    this.logger.info({ taskId: id }, 'Task updated');

    return updatedTask;
  }

  async find(): Promise<Task[]> {
    this.logger.info('Fetching all tasks');
    const tasks = await this.taskRepository.find();
    return tasks;
  }

  async findOne(id: string): Promise<Task> {
    this.logger.info({ taskId: id }, 'Fetchig a task');
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      this.logger.warn({ taskId: id }, 'Task not found');
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  async findTasksOfAProject(projectId: string): Promise<Task[]> {
    this.logger.info({ projectId }, 'Fetching tasks of a project');
    const tasks = await this.taskRepository.findBy({ projectId });
    return tasks;
  }
}
