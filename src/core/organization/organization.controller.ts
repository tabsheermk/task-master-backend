import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganization } from './dtos/create-organization.dto';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class OrganizationController {
  constructor(
    @Inject()
    private organizationService: OrganizationService,
  ) {}

  @Post('/organizations')
  async create(@Body() org: CreateOrganization) {
    const data = await this.organizationService.create(org);
    return {
      data,
      message: 'created successfully',
    };
  }

  @Get('/organizations/:id')
  async get(@Param('id') id: string) {
    const data = await this.organizationService.findOne(id);
    return {
      data,
      message: 'fetched successfully',
    };
  }

  @Get('/organizations')
  async getAll() {
    const data = await this.organizationService.findAll();
    return {
      data,
      count: data.length,
      message: 'fetched successfully',
    };
  }

  @Delete('/organizations/:id')
  async delete(@Param('id') id: string) {
    return this.organizationService.remove(id);
  }
}
