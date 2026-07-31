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
import { CommentService } from './comment.service';
import { PinoLogger } from 'nestjs-pino';
import { CurrentUser } from 'src/common/decorators/current-user';
import { CreateComment } from './dtos/create-comment.dto';
import { UpdateComment } from './dtos/update-comment.dto';
import { User } from 'src/core/user/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(
    @Inject() private commentService: CommentService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CommentController.name);
  }

  @Post()
  async create(@Body() data: CreateComment, @CurrentUser() user: User) {
    this.logger.info('Create a comment');
    const res = await this.commentService.create(data, user);
    return {
      data: res,
      message: 'Comment created successfully',
    };
  }

  @Put('/:id')
  async update(@Body() data: UpdateComment, @Param('id') id: string) {
    this.logger.info('Updating a comment');
    const res = await this.commentService.update(id, data);
    return {
      data: res,
      message: 'Comment updated successfully',
    };
  }

  @Get()
  async find() {
    this.logger.info('Fetching all comments');
    const res = await this.commentService.find();
    return {
      data: res,
      message: 'Comments fetched successfully',
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    this.logger.info('Fetching a comment');
    const res = await this.commentService.findOne(id);
    return {
      data: res,
      message: 'Comment fetched successfully',
    };
  }

  @Get('/task/:taskId')
  async getCommentsOnATask(@Param('taskId') taskId: string) {
    this.logger.info('Fetching comments of a task');
    const res = await this.commentService.findCommentsOnATask(taskId);
    return {
      data: res,
      message: 'Comments of a task fetched successfully',
    };
  }
}
