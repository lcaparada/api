import { Entity } from '../../domain/entities/entity';
import { SearchResult } from '../../domain/repositories/searchable.repository.interface';

export type PaginationOutputDto<Item = any> = {
  items: Item[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    result: SearchResult<Entity>,
  ): PaginationOutputDto<Item> {
    return {
      items,
      total: result.total,
      currentPage: result.currentPage,
      lastPage: result.lastPage,
      perPage: result.perPage,
    };
  }
}
