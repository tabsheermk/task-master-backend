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
import { CurrentUser } from 'src/common/decorators/current-user';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { User } from 'src/core/user/entities/user.entity';
import { CreateProject } from './dtos/create-project.dto';
import { UpdateProject } from './dtos/update-project.dto';
import { ProjectService } from './project.service';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(
    @Inject() private projectService: ProjectService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProjectController.name);
  }

  @Post()
  async create(@Body() data: CreateProject, @CurrentUser() user: User) {
    this.logger.info('Inside create method');
    const res = await this.projectService.create(data, user);
    return {
      data: res,
      message: 'Project created successfully',
    };
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateProject) {
    this.logger.info('Inside update method');
    const res = await this.projectService.update(id, data);
    return {
      data: res,
      message: 'Project updated successfully',
    };
  }

  @Get()
  async find() {
    this.logger.info('Inside find method');
    const res = await this.projectService.find();
    return {
      data: res,
      count: res.length,
      message: 'Projects fetched successfully',
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    this.logger.info('Inside find one method');
    const res = await this.projectService.findOne(id);
    return {
      data: res,
      message: 'Project fetched successfully',
    };
  }
}
