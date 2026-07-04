import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationModule } from './core/organization/organization.module';
import { UserModule } from './core/user/user.module';

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
    UserModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
