import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { CreateProject } from './dtos/create-project.dto';
import { UpdateProject } from './dtos/update-project.dto';
import { User } from 'src/core/user/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProjectService.name);
  }

  async create(data: CreateProject, user: User): Promise<Project> {
    this.logger.info('Inside create method');
    const name = data.name;

    const existingProject = await this.projectRepository.findOneBy({ name });

    if (existingProject) {
      this.logger.warn('Project with name already exists', existingProject);
      throw new ConflictException('Project with name already exists');
    }

    const project = this.projectRepository.create({
      ...data,
      createdBy: user.id,
    });
    await this.projectRepository.save(project);

    return project;
  }

  async update(id: string, data: UpdateProject): Promise<Project> {
    this.logger.info({ projectId: id }, 'Updating project');
    const existingProject = await this.projectRepository.findOneBy({ id });

    if (!existingProject) {
      this.logger.warn({ projectId: id }, 'Project not found');
      throw new NotFoundException(`Project with id: ${id} not found`);
    }

    Object.assign(existingProject, data);

    const updatedProject = await this.projectRepository.save(existingProject);

    this.logger.info({ projectId: id }, 'Project updated');

    return updatedProject;
  }

  async find(): Promise<Project[]> {
    this.logger.info('Inside find method');
    const projects = await this.projectRepository.find();
    return projects;
  }

  async findOne(id: string): Promise<Project> {
    this.logger.info({ projectId: id }, 'fetch project');
    const project = await this.projectRepository.findOneBy({ id });

    if (!project) {
      this.logger.warn({ projectId: id }, 'Project not found');
      throw new NotFoundException(`Project with id: ${id} not found`);
    }

    this.logger.info({ projectId: id }, 'Project fetched successfully');
    return project;
  }

  async findOneByKey(key: string): Promise<Project> {
    this.logger.info({ projectKey: key }, 'fetch project');
    const project = await this.projectRepository.findOneBy({ key });

    if (!project) {
      this.logger.warn({ projectKey: key }, 'Project not found');
      throw new NotFoundException(`Project with key: ${key} not found`);
    }

    this.logger.info({ projectKey: key }, 'Project fetched successfully');
    return project;
  }
}
