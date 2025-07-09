import { UserEntity } from '../../../../domain/entities/user.entity';
import {
  SearchParams,
  SearchResult,
  UserRepository,
} from '../../../../domain/repositories/user.repository';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { UserModelMapper } from '../models/user.model-mapper';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { ConflictError } from '../../../../../shared/domain/errors/conflict.error';

export class UserPrismaRepository implements UserRepository {
  sortableFields: string[] = ['name', 'createdAt'];

  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserModel not found using email : ${email}`);
    }
  }

  async emailExists(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) {
      throw new ConflictError(`Email already exists`);
    }
  }

  async search(props: SearchParams): Promise<SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'createdAt';
    const orderByDir = sortable ? props.sortDir : 'desc';
    const count = await this.prismaService.user.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    });
    const models = await this.prismaService.user.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new SearchResult({
      items: models.map((model) => UserModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      filter: props.filter,
      sort: orderByField,
      sortDir: orderByDir,
    });
  }

  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({ data: entity.toJSON() });
  }

  findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }

  async findAll(): Promise<UserEntity[]> {
    const userModels = await this.prismaService.user.findMany();
    return userModels.map((user) => UserModelMapper.toEntity(user));
  }

  async update(entity: UserEntity): Promise<void> {
    await this._get(entity.id);
    await this.prismaService.user.update({
      where: {
        id: entity.id,
      },
      data: entity.toJSON(),
    });
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.prismaService.user.delete({ where: { id } });
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserModel not found using ID : ${id}`);
    }
  }
}
