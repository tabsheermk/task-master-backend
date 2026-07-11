import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { PinoLogger } from 'nestjs-pino';
import { Membership } from './entities/membership.entity';

@UseGuards(JwtAuthGuard)
@Controller('memberships')
export class MembershipController {
  constructor(
    @Inject()
    private membershipService: MembershipService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(MembershipController.name);
  }

  @Post()
  async create(@Body() data: Membership) {
    this.logger.info('Inside create method');
    const res = await this.membershipService.create(data);
    return {
      data: res,
      message: 'Membership created successfully',
    };
  }

  @Get()
  async find() {
    this.logger.info('Inside find method');
    const res = await this.membershipService.find();
    return {
      data: res,
      count: res.length,
      message: 'Memberships fetched successfully',
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    this.logger.info('Inside findOne method');
    const res = await this.membershipService.findOne(id);
    return {
      data: res,
      message: 'Membership fetched successfully',
    };
  }
}
