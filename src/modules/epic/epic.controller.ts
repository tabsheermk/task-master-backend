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
import { CreateEpic } from './dtos/create-epic.dto';
import { UpdateEpic } from './dtos/update-epic.dto';
import { EpicService } from './epic.service';

@UseGuards(JwtAuthGuard)
@Controller('epics')
export class EpicController {
  constructor(
    @Inject() private epicService: EpicService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EpicController.name);
  }

  @Post()
  async create(@Body() data: CreateEpic, @CurrentUser() user: User) {
    this.logger.info('Creating an epic');
    const res = await this.epicService.create(data, user);
    return {
      data: res,
      message: 'Epic created successfully',
    };
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() data: UpdateEpic) {
    this.logger.info('Updating an epic');
    const res = await this.epicService.update(id, data);
    return {
      data: res,
      message: 'Epic updated sucessfully',
    };
  }

  @Get()
  async find() {
    this.logger.info('Fetching all epics');
    const res = await this.epicService.find();
    return {
      data: res,
      count: res.length,
      message: 'Epics fetched successfully',
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    this.logger.info('Fetching an epic');
    const res = await this.epicService.findOne(id);
    return {
      data: res,
      message: 'Epic fetched successfully',
    };
  }
}
