import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { EnvConfigModule } from '../env-config/env-config.module';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [PrismaService, ConfigService],
  imports: [EnvConfigModule.forRoot()],
  exports: [PrismaService],
})
export class DatabaseModule {}
