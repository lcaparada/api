import { hash, compare } from 'bcryptjs';
import { HashProvider } from '../../../../shared/application/providers/hash.provider';

export class BCryptjsHashProvider implements HashProvider {
  async compareHash(payload: string, hash: string): Promise<boolean> {
    const result = await compare(payload, hash);
    return result;
  }

  async generateHash(payload: string): Promise<string> {
    const result = await hash(payload, 6);
    return result;
  }
}
