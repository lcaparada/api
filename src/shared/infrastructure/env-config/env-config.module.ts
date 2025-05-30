import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { EnvConfigService } from './env-config.service';
import { join } from 'node:path';

@Module({})
export class EnvConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    const envFile = join(__dirname, `../../../../.env.${process.env.NODE_ENV}`);

    return {
      module: EnvConfigModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: [envFile],
          isGlobal: true,
          ...options,
        }),
      ],
      providers: [EnvConfigService],
      exports: [EnvConfigService, ConfigModule],
    };
  }
}
