import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '../../../../../shared/infrastructure/database/prisma/testing/setup.prisma.testing';
import { UserPrismaRepository } from '../../../../infrastructure/database/prisma/repositories/user.prisma.repository';
import { DatabaseModule } from '../../../../../shared/infrastructure/database/database.module';
import { SignUpUseCase } from '../../sign-up.use-case';
import { HashProvider } from '../../../../../shared/application/providers/hash.provider';
import { BCryptjsHashProvider } from '../../../../infrastructure/providers/hashProvider/bcryptjs.hash-provider';

describe('SignUpUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SignUpUseCase;
  let module: TestingModule;
  let repository: UserPrismaRepository;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BCryptjsHashProvider();
  });

  beforeEach(async () => {
    sut = new SignUpUseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
    await prismaService.$disconnect();
  });

  it('should create a user', async () => {
    const props = {
      name: 'test',
      email: 'a@a.com',
      password: 'fake',
    };

    const output = await sut.execute(props);

    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
