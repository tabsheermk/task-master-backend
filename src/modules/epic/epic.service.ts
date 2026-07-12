import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Epic, EpicStatus } from './entities/epic.entity';
import { PinoLogger } from 'nestjs-pino';
import { CreateEpic } from './dtos/create-epic.dto';
import { User } from 'src/core/user/entities/user.entity';
import { UpdateEpic } from './dtos/update-epic.dto';

@Injectable()
export class EpicService {
  constructor(
    @InjectRepository(Epic) private epicRepository: Repository<Epic>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EpicService.name);
  }

  async create(data: CreateEpic, user: User): Promise<Epic> {
    this.logger.info({ projectId: data.projectId }, 'Creating an epic');
    const epic = this.epicRepository.create({
      ...data,
      createdBy: user.id,
      status: EpicStatus.CREATED,
    });
    return await this.epicRepository.save(epic);
  }

  async update(id: string, data: UpdateEpic): Promise<Epic> {
    this.logger.info({ epicId: id }, 'Updating an epic');

    const epic = await this.epicRepository.findOneBy({ id });

    if (!epic) {
      this.logger.warn({ epicId: id }, 'Epic not found');
      throw new NotFoundException(`Epic ${id} not found`);
    }

    Object.assign(epic, data);

    const updatedEpic = await this.epicRepository.save(epic);

    this.logger.info({ epicId: id }, 'Epic updated');

    return updatedEpic;
  }

  async find(): Promise<Epic[]> {
    this.logger.info('Fetching all epics');
    const epics = await this.epicRepository.find();
    return epics;
  }

  async findOne(id: string): Promise<Epic> {
    this.logger.info({ epicId: id }, 'Fetching an epic');

    const epic = await this.epicRepository.findOneBy({ id });

    if (!epic) {
      this.logger.warn({ epicId: id }, 'Epic not found');
      throw new NotFoundException(`Epic ${id} not found`);
    }

    return epic;
  }
}
