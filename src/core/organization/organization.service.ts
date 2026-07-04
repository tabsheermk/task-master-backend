import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { CreateOrganization } from './dtos/create-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  findAll(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  findOne(id: string): Promise<Organization | null> {
    return this.organizationRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.organizationRepository.softDelete({ id });
  }

  async create(data: CreateOrganization): Promise<Organization> {
    const organization = this.organizationRepository.create(data);
    return await this.organizationRepository.save(organization);
  }
}
