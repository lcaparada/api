import { Entity } from '../entities/entity';
import { RepositoryInterface } from './repository.interface';

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string> = {
  page?: number;
  sort?: string | null;
  perPage?: number;
  sortDir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchParams {
  protected _page = 1;
  protected _perPage = 15;
  protected _sort: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: string | null;

  constructor(props: SearchProps) {
    this._perPage = props.perPage;
    this._page = props.page;
    this._sort = props.sort;
    this._sortDir = props.sortDir;
    this._filter = props.filter;
  }

  get page() {
    return this._page;
  }

  private set page(value: number) {}

  get perPage() {
    return this._perPage;
  }

  private set perPage(value: number) {}

  get sort() {
    return this._sort;
  }

  private set sort(value: string | null) {}

  get filter() {
    return this._filter;
  }

  private set filter(value: string | null) {}

  get sortDir() {
    return this._sortDir;
  }

  private set sortDir(value: SortDirection | null) {}
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SearchOutput>;
}
