import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationModule } from './core/organization/organization.module';
import { UserModule } from './core/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { MembershipModule } from './core/membership/membership.module';
import { LoggerModule } from 'nestjs-pino';
import { ProjectModule } from './modules/project/project.module';
import { Request, Response } from 'express';

// Setup proper migrations stuff later
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('PG_HOST'),
        port: config.get<number>('PG_PORT'),
        username: config.get<string>('PG_USER'),
        password: config.get<string>('PG_PASSWORD'),
        database: config.get<string>('PG_DATABASE'),
        ssl: true,
        synchronize: config.get<string>('ENV') === 'development',
        autoLoadEntities: true,
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          serializers: {
            req(req: Request) {
              return {
                id: req.id,
                method: req.method,
                url: req.url,
              };
            },
            res(res: Response) {
              return {
                statusCode: res.statusCode,
              };
            },
          },

          transport:
            config.get<string>('ENV') !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                  },
                }
              : undefined,
          redact: ['req.headers.authorization'],
        },
      }),
    }),
    UserModule,
    AuthModule,
    OrganizationModule,
    MembershipModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
