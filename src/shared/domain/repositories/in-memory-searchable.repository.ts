import { Entity } from '../entities/entity';
import { InMemoryRepository } from './in-memory.repository';
import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from './searchable.repository.interface';

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  async search(props: SearchParams): Promise<SearchResult<E>> {
    throw new Error(`Method not implemented. ${props}`);
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDir: string | null,
  ): Promise<E[]> {}

  protected async applyPaginate(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {}
}
