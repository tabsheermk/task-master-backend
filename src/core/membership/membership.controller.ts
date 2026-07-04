import { Controller, Inject } from '@nestjs/common';
import { MembershipService } from './membership.service';

@Controller()
export class MembershipController {
  constructor(
    @Inject()
    private membershipService: MembershipService,
  ) {}
}
