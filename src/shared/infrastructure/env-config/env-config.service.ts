import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env-config.interface';

@Injectable()
export class EnvConfigService implements EnvConfig {}
