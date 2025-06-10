import { Entity } from '../../../../../shared/domain/entities/entity';
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository';
import {
  SearchParams,
  SearchResult,
} from '../../searchable.repository.interface';

interface StubEntityProps {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name'];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) =>
      item.props.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}

describe('InMemorySearchableRepository unit tests', () => {
  let sut: StubInMemorySearchableRepository;

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository();
  });

  describe('ApplyFilter method', () => {
    it('should return all items if filter param is null', async () => {
      const items = [new StubEntity({ name: 'new name', price: 10 })];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      const itemsFiltered = await sut['applyFilter'](items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should filter using filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'TEST', price: 20 }),
        new StubEntity({ name: 'John Doe', price: 30 }),
      ];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      let itemsFiltered = await sut['applyFilter'](items, 'TEST');
      expect(itemsFiltered).toStrictEqual(items.slice(0, 2));
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await sut['applyFilter'](items, 'test');
      expect(itemsFiltered).toStrictEqual(items.slice(0, 2));
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await sut['applyFilter'](items, 'john doe');
      expect(itemsFiltered).toStrictEqual([items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);

      itemsFiltered = await sut['applyFilter'](items, 'no-filter');
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(4);
    });
  });

  describe('ApplySort method', () => {
    it('should return all items if sort param is null', async () => {
      const items = [new StubEntity({ name: 'a', price: 10 })];
      const sortedItems = await sut['applySort'](items, null, null);

      expect(items).toStrictEqual(sortedItems);
    });

    it(`should all items if sortableFields doesn't includes sort`, async () => {
      const items = [new StubEntity({ name: 'a', price: 10 })];

      const sortedItems = await sut['applySort'](items, 'price', 'asc');

      expect(items).toStrictEqual(sortedItems);
    });

    it(`should sort items`, async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'c', price: 10 }),
      ];

      let sortedItems = await sut['applySort'](items, 'name', 'asc');
      expect(sortedItems).toStrictEqual([items[1], items[0], items[2]]);

      sortedItems = await sut['applySort'](items, 'name', 'desc');
      expect(sortedItems).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe('ApplyPaginate method', () => {
    it('should return paginated items', async () => {
      const items = [
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'b', price: 20 }),
        new StubEntity({ name: 'c', price: 30 }),
        new StubEntity({ name: 'd', price: 40 }),
        new StubEntity({ name: 'e', price: 50 }),
      ];
      let paginatedItems = await sut['applyPaginate'](items, 1, 2);

      expect(paginatedItems).toStrictEqual([items[0], items[1]]);

      paginatedItems = await sut['applyPaginate'](items, 2, 2);

      expect(paginatedItems).toStrictEqual([items[2], items[3]]);

      paginatedItems = await sut['applyPaginate'](items, 3, 2);

      expect(paginatedItems).toStrictEqual([items[4]]);

      paginatedItems = await sut['applyPaginate'](items, 4, 2);

      expect(paginatedItems).toHaveLength(0);
    });
  });

  describe('Search method', () => {
    it('should apply only pagination parameter when other params are null', async () => {
      const entity = new StubEntity({ name: 'test', price: 10 });
      const items: StubEntity[] = Array(16).fill(entity);

      sut.items = items;

      const params = await sut.search(new SearchParams({}));

      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          sort: null,
          filter: null,
          perPage: 15,
          sortDir: null,
        }),
      );
    });

    it('should apply paginate and filter parameters', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 10 }),
        new StubEntity({ name: 'a', price: 20 }),
        new StubEntity({ name: 'TEST', price: 30 }),
        new StubEntity({ name: 'TeSt', price: 40 }),
      ];

      sut.items = items;

      let params = await sut.search(
        new SearchParams({ page: 1, perPage: 2, filter: 'TEST' }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          sort: null,
          filter: 'TEST',
          perPage: 2,
          sortDir: null,
        }),
      );

      params = await sut.search(
        new SearchParams({ page: 2, perPage: 2, filter: 'TEST' }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          sort: null,
          filter: 'TEST',
          perPage: 2,
          sortDir: null,
        }),
      );
    });

    it('should apply paginate and sort parameters', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 10 }),
        new StubEntity({ name: 'a', price: 20 }),
        new StubEntity({ name: 'd', price: 30 }),
        new StubEntity({ name: 'e', price: 40 }),
        new StubEntity({ name: 'c', price: 40 }),
      ];

      sut.items = items;

      let params = await sut.search(
        new SearchParams({ page: 1, perPage: 2, sort: 'name' }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3], items[2]],
          total: 5,
          currentPage: 1,
          sort: 'name',
          filter: null,
          perPage: 2,
          sortDir: 'desc',
        }),
      );

      params = await sut.search(
        new SearchParams({ page: 2, perPage: 2, sort: 'name' }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[0]],
          total: 5,
          currentPage: 2,
          sort: 'name',
          filter: null,
          perPage: 2,
          sortDir: 'desc',
        }),
      );

      params = await sut.search(
        new SearchParams({ page: 3, perPage: 2, sort: 'name' }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1]],
          total: 5,
          currentPage: 3,
          sort: 'name',
          filter: null,
          perPage: 2,
          sortDir: 'desc',
        }),
      );

      params = await sut.search(
        new SearchParams({ page: 4, perPage: 2, sort: 'name' }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [],
          total: 5,
          currentPage: 4,
          sort: 'name',
          filter: null,
          perPage: 2,
          sortDir: 'desc',
        }),
      );

      params = await sut.search(
        new SearchParams({ page: 1, perPage: 2, sort: 'name', sortDir: 'asc' }),
      );

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1], items[0]],
          total: 5,
          currentPage: 1,
          sort: 'name',
          filter: null,
          perPage: 2,
          sortDir: 'asc',
        }),
      );
    });
  });
});
