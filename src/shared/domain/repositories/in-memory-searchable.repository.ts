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
  sortableFields: string[] = [];

  async search(props: SearchParams): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter);

    const sortedItems = await this.applySort(
      filteredItems,
      props.sort,
      props.sortDir,
    );

    const paginatedItems = await this.applyPaginate(
      sortedItems,
      props.page,
      props.perPage,
    );

    return new SearchResult({
      items: paginatedItems,
      total: filteredItems.length,
      currentPage: props.page,
      sort: props.sort,
      filter: props.filter,
      perPage: props.perPage,
      sortDir: props.sortDir,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: string | null,
  ): Promise<E[]>;

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDir: string | null = 'desc',
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      if (a.props[sort] < b.props[sort]) {
        return sortDir === 'asc' ? -1 : 1;
      }
      if (a.props[sort] > b.props[sort]) {
        return sortDir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  protected async applyPaginate(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage;
    const limit = start + perPage;

    return items.slice(start, limit);
  }
}
