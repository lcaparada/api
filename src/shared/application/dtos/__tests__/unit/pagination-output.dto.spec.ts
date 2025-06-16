import { SearchResult } from '../../../../domain/repositories/searchable.repository.interface';
import { PaginationOutputMapper } from '../../pagination-output.dto';

describe('PaginationOutputMapper unit tests', () => {
  it('should convert a SearchResult to output', () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      currentPage: 1,
      filter: null,
      perPage: 1,
      sort: null,
      sortDir: null,
      total: 1,
    });
    const sut = PaginationOutputMapper.toOutput(result.items, result);
    expect(sut).toStrictEqual({
      items: ['fake'],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    });
  });
});
