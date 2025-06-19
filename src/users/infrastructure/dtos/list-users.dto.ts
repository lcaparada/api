import { SortDirection } from '../../../shared/domain/repositories/searchable.repository.interface';
import { ListUsersUseCaseInput } from '../../application/useCases/list-users.use-case';

export class ListUsersDto implements ListUsersUseCaseInput {
  filter?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
}
