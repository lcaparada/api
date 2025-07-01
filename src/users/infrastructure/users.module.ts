import { HashProvider } from './../../shared/application/providers/hash.provider';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SignUpUseCase } from '../application/useCases/sign-up.use-case';
import { BCryptjsHashProvider } from './providers/hashProvider/bcryptjs.hash-provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { SignInUseCase } from '../application/useCases/sign-in.use-case';
import { GetUserUseCase } from '../application/useCases/get-user.use-case';
import { ListUsersUseCase } from '../application/useCases/list-users.use-case';
import { UpdatePasswordUseCase } from '../application/useCases/update-password.use-case';
import { UpdateUserUseCase } from '../application/useCases/update-user.use-case';
import { DeleteUserUseCase } from '../application/useCases/delete-user.use-case';
import { PrismaService } from '../../shared/infrastructure/database/prisma/prisma.service';
import { UserPrismaRepository } from './database/prisma/repositories/user.prisma.repository';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
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
    {
      provide: SignInUseCase,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProvider,
      ) => {
        return new SignInUseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new GetUserUseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new ListUsersUseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUseCase,
      useFactory: (
        userRepository: UserRepository,
        hashProvider: HashProvider,
      ) => {
        return new UpdatePasswordUseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new UpdateUserUseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserRepository) => {
        return new DeleteUserUseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
