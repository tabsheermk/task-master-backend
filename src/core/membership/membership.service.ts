import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { Repository } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    private readonly logger: PinoLogger,
  ) {}

  async create(data: Membership) {
    const membership = this.membershipRepository.create(data);
    return await this.membershipRepository.save(membership);
  }

  async find() {
    return await this.membershipRepository.find();
  }

  async findOne(id: string) {
    const membership = await this.membershipRepository.findOneBy({ id });
    return membership;
  }
}
