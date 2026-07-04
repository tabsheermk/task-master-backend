import { Controller, Inject, UseGuards } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class MembershipController {
  constructor(
    @Inject()
    private membershipService: MembershipService,
  ) {}
}
