import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUser } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(data: CreateUser): Promise<User> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.softDelete({ id });
  }
}
