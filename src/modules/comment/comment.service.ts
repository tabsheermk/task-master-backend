import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { CreateComment } from './dtos/create-comment.dto';
import { User } from 'src/core/user/entities/user.entity';
import { UpdateComment } from './dtos/update-comment.dto';
import { NotFoundException } from '@nestjs/common';

export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private logger: PinoLogger,
  ) {
    this.logger.setContext(CommentService.name);
  }

  async create(data: CreateComment, user: User): Promise<Comment> {
    this.logger.info('Creating a comment');
    const comment = this.commentRepository.create({ ...data, userId: user.id });
    return await this.commentRepository.save(comment);
  }

  async update(id: string, data: UpdateComment): Promise<Comment> {
    this.logger.info({ commentId: id }, 'Updating a comment');
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) {
      this.logger.warn({ commentId: id }, 'Comment not found');
      throw new NotFoundException(`Comment ${id} not found`);
    }

    Object.assign(comment, data);

    await this.commentRepository.save(comment);

    this.logger.info({ commentId: id }, 'Comment updated');

    return comment;
  }

  async find(): Promise<Comment[]> {
    this.logger.info('Fetching all comments');
    const comments = await this.commentRepository.find();
    return comments;
  }

  async findOne(id: string): Promise<Comment> {
    this.logger.info({ commentId: id }, 'Fetching a comment');
    const comment = await this.commentRepository.findOneBy({ id });

    if (!comment) {
      this.logger.warn({ commentId: id }, 'Comment not found');
      throw new NotFoundException(`Comment ${id} not found`);
    }

    return comment;
  }
}
