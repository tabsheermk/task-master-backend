import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}
}
