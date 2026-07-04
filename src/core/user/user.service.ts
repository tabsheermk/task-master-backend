import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.softDelete({ id });
  }
}
