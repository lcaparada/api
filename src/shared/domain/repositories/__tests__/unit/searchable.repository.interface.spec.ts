import { SearchParams } from '../../searchable.repository.interface';

describe('SearchableRepositoryInterface unit test', () => {
  describe('SearchParams', () => {
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
  });
});
