import {
  SearchParams,
  SearchResult,
} from '../../searchable.repository.interface';

describe('SearchableRepositoryInterface unit test', () => {
  describe('SearchParams tests', () => {
    it('Page prop', () => {
      const sut = new SearchParams({});

      expect(sut.page).toStrictEqual(1);

      const params = [
        { page: null, expected: 1 },
        { page: 'test', expected: 1 },
        { page: undefined, expected: 1 },
        { page: '', expected: 1 },
        { page: 5.5, expected: 1 },
        { page: 0, expected: 1 },
        { page: {}, expected: 1 },
        { page: false, expected: 1 },
        { page: 2, expected: 2 },
        { page: -1, expected: 1 },
      ];

      params.forEach((param) =>
        expect(new SearchParams({ page: param.page as any }).page).toEqual(
          param.expected,
        ),
      );
    });

    it('PerPage prop', () => {
      const sut = new SearchParams({});

      expect(sut.perPage).toStrictEqual(15);

      const params = [
        { perPage: null, expected: 15 },
        { perPage: 'test', expected: 15 },
        { perPage: undefined, expected: 15 },
        { perPage: '', expected: 15 },
        { perPage: 5.5, expected: 15 },
        { perPage: 0, expected: 15 },
        { perPage: {}, expected: 15 },
        { perPage: false, expected: 15 },
        { perPage: true, expected: 15 },
        { perPage: 2, expected: 2 },
        { perPage: -10, expected: 15 },
      ];

      params.forEach((param) =>
        expect(
          new SearchParams({ perPage: param.perPage as any }).perPage,
        ).toEqual(param.expected),
      );
    });

    it('Sort prop', () => {
      const params = [
        { value: '', expected: null },
        { value: undefined, expected: null },
        { value: null, expected: null },
        { value: 'name', expected: 'name' },
      ];

      params.forEach((param) =>
        expect(new SearchParams({ sort: param.value }).sort).toEqual(
          param.expected,
        ),
      );
    });

    it('SortDir prop', () => {
      expect(new SearchParams({ sortDir: 'asc' }).sortDir).toBeNull();

      const params = [
        { sortValue: '', sortDirValue: null, expectedSortDir: null },
        { sortValue: '', sortDirValue: null, expectedSortDir: null },
        { sortValue: 'field', sortDirValue: null, expectedSortDir: 'desc' },
        { sortValue: 'field', sortDirValue: 'ASC', expectedSortDir: 'asc' },
        { sortValue: 'field', sortDirValue: 'DESC', expectedSortDir: 'desc' },
        { sortValue: undefined, sortDirValue: 'asc', expectedSortDir: null },
        { sortValue: null, sortDirValue: null, expectedSortDir: null },
        { sortValue: 'name', sortDirValue: 'asc', expectedSortDir: 'asc' },
        { sortValue: '25', sortDirValue: 'desc', expectedSortDir: 'desc' },
        { sortValue: '-1', sortDirValue: 'asc', expectedSortDir: 'asc' },
      ];

      params.forEach((param) =>
        expect(
          new SearchParams({
            sort: param.sortValue,
            sortDir: param.sortDirValue as any,
          }).sortDir,
        ).toEqual(param.expectedSortDir),
      );
    });

    it('Filter prop', () => {
      const params = [
        { value: '', expected: null },
        { value: undefined, expected: null },
        { value: null, expected: null },
        { value: 'name', expected: 'name' },
      ];

      params.forEach((param) =>
        expect(new SearchParams({ filter: param.value }).filter).toEqual(
          param.expected,
        ),
      );
    });
  });

  describe('SearchResult tests', () => {
    it('constructor props', () => {
      let sut = new SearchResult({
        items: ['test1', 'test2'] as any,
        total: 4,
        perPage: 2,
        currentPage: 1,
        filter: null,
        sort: null,
        sortDir: null,
      });

      expect(sut.toJSON()).toStrictEqual({
        items: ['test1', 'test2'] as any,
        total: 4,
        perPage: 2,
        currentPage: 1,
        filter: null,
        sort: null,
        lastPage: 2,
        sortDir: null,
      });

      sut = new SearchResult({
        items: ['test1', 'test2'] as any,
        total: 4,
        perPage: 2,
        currentPage: 1,
        filter: 'test',
        sort: 'name',
        sortDir: 'asc',
      });

      expect(sut.toJSON()).toStrictEqual({
        items: ['test1', 'test2'] as any,
        total: 4,
        perPage: 2,
        currentPage: 1,
        filter: 'test',
        sort: 'name',
        lastPage: 2,
        sortDir: 'asc',
      });

      sut = new SearchResult({
        items: ['test1', 'test2'] as any,
        total: 4,
        perPage: 10,
        currentPage: 1,
        filter: 'test',
        sort: 'name',
        sortDir: 'asc',
      });

      expect(sut.lastPage).toBe(1);

      sut = new SearchResult({
        items: ['test1', 'test2'] as any,
        total: 54,
        perPage: 10,
        currentPage: 1,
        filter: 'test',
        sort: 'name',
        sortDir: 'asc',
      });

      expect(sut.lastPage).toBe(6);
    });
  });
});
