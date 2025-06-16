import { SortDirection } from '../../../shared/domain/repositories/searchable.repository.interface';

export type SearchInputDto<Filter = string> = {
  page?: number;
  sort?: string | null;
  perPage?: number;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};
