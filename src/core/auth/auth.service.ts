import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { Membership, Role } from '../membership/entities/membership.entity';
import { Organization } from '../organization/entities/organization.entity';
import { User } from '../user/entities/user.entity';
import { LoginUser } from './dtos/login.dto';
import { RegisterUser } from './dtos/register.dto';
import { RefreshToken } from './entities/refresh_tokens.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    data: RegisterUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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

    const existingOrg = await this.dataSource.getRepository(Organization).findOneBy({ name: data.organizationName });
    if (existingOrg) {
      throw new ConflictException('Organization name already in use');
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

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: '30m',
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const saveToken = this.refreshTokenRepository.create({
        userId: user.id,
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt,
      });

      await this.refreshTokenRepository.save(saveToken);

      return { accessToken, refreshToken };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(
    data: LoginUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.userRepository.findOneBy({
      username: data.username,
    });

    if (!existingUser) {
      throw new NotFoundException('No user with this username exists');
    }

    const hash = await bcrypt.compare(data.password, existingUser.password);

    if (!hash) {
      throw new BadRequestException('Password wrong');
    }

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '30m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const token = await this.refreshTokenRepository.findOneBy({
      userId: existingUser.id,
      isRevoked: false,
    });

    if (token) {
      await this.refreshTokenRepository.update(
        { userId: existingUser.id },
        {
          tokenHash: await bcrypt.hash(refreshToken, 10),
          expiresAt,
        },
      );
    } else {
      await this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          userId: existingUser.id,
          tokenHash: await bcrypt.hash(refreshToken, 10),
          expiresAt,
        }),
      );
    }

    return { accessToken, refreshToken };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: { sub: string; email: string } =
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) {
      throw new NotFoundException('User doesn not exist');
    }

    const data = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(data, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: '30m',
    });

    const newToken = await this.jwtService.signAsync(data, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const token = await this.refreshTokenRepository.findOneBy({
      userId: user.id,
      isRevoked: false,
    });

    if (token) {
      const matches = await bcrypt.compare(refreshToken, token.tokenHash);

      if (!matches) {
        throw new UnauthorizedException();
      }

      await this.refreshTokenRepository.update(
        { userId: user.id },
        {
          tokenHash: await bcrypt.hash(newToken, 10),
          expiresAt,
        },
      );
    } else {
      await this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          userId: user.id,
          tokenHash: await bcrypt.hash(newToken, 10),
          expiresAt,
        }),
      );
    }

    return {
      accessToken,
      refreshToken: newToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const payload: { sub: string; email: string } =
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) {
      throw new NotFoundException('User doesn not exist');
    }

    const token = await this.refreshTokenRepository.findOneBy({
      userId: user.id,
      isRevoked: false,
    });

    if (!token) {
      throw new BadRequestException('User already logged out');
    }

    token.isRevoked = true;

    await this.refreshTokenRepository.save(token);
  }
}

// Currently this implementation makes only user being logged in possible
