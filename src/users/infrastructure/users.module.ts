import { HashProvider } from './../../shared/application/providers/hash.provider';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SignUpUseCase } from '../application/useCases/sign-up.use-case';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { BCryptjsHashProvider } from './providers/hashProvider/bcryptjs.hash-provider';
import { UserRepository } from '../domain/repositories/user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BCryptjsHashProvider,
    },
    {
      provide: SignUpUseCase,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProvider,
      ) => {
        return new SignUpUseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
  ],
})
export class UsersModule {}
