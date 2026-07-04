import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RegisterUser } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(data: RegisterUser): Promise<User | null> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { organizationName, ...userData } = data;

    try {
      await queryRunner.manager.save(userData);

      await queryRunner.manager.save(organizationName);

      await queryRunner.commitTransaction();
    } catch {}
    return null;
  }
}
