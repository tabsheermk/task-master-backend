import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RegisterUser } from './dtos/register.dto';
import { Organization } from '../organization/entities/organization.entity';
import { Membership, Role } from '../membership/entities/membership.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterUser): Promise<{ accessToken: string }> {
    const existingByName = await this.userRepository.findOneBy({
      username: data.username,
    });

    if (existingByName) {
      throw new BadRequestException('User with this username already exists');
    }

    const existingUser = await this.userRepository.findOneBy({
      email: data.email,
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { organizationName, password, ...userData } = data;

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const user = queryRunner.manager.create(User, {
        ...userData,
        password: hashedPassword,
      });
      await queryRunner.manager.save(user);

      const organization = queryRunner.manager.create(Organization, {
        name: organizationName,
      });
      await queryRunner.manager.save(organization);

      const membership = queryRunner.manager.create(Membership, {
        userId: user.id,
        organizationId: organization.id,
        role: Role.OWNER,
        joinedAt: new Date(),
      });

      await queryRunner.manager.save(membership);

      await queryRunner.commitTransaction();

      const payload = {
        sub: user.id,
        email: user.email,
      };

      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } catch {
      throw new HttpException('request failed', 400);
    }
  }
}
