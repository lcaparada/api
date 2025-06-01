import { NotFoundError } from '../../../../../shared/domain/errors/not-found-error';
import { Entity } from '../../../../../shared/domain/entities/entity';
import { InMemoryRepository } from '../../in-memory.repository';

type StubEntityProps = {
  name: string;
  price: number;
};

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}
describe('InMemoryRepository unit tests', () => {
  let sut: StubInMemoryRepository;

  beforeEach(() => {
    sut = new StubInMemoryRepository();
  });

  it('Should inserts a new entity', async () => {
    const entity = new StubEntity({ name: 'other name', price: 10 });

    await sut.insert(entity);
    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON());
  });

  describe('FindById', () => {
    it('Should throw error when entity not found', async () => {
      await expect(sut.findById('123')).rejects.toThrow(
        new NotFoundError('Entity not found'),
      );
    });

    it('Should return an entity by id', async () => {
      const entity = new StubEntity({ name: 'other name', price: 10 });

      await sut.insert(entity);

      const foundedEntity = await sut.findById(entity.id);

      expect(foundedEntity).toBeDefined();
      expect(foundedEntity.toJSON()).toStrictEqual(entity.toJSON());
    });
  });

  describe('FindAll', () => {
    it('Should return a entity by id', async () => {
      const entity = new StubEntity({ name: 'other name', price: 10 });

      await sut.insert(entity);

      const foundEntities = await sut.findAll();

      expect(foundEntities).toBeDefined();
      expect(foundEntities).toContain(entity);
    });
  });

  describe('Update', () => {
    it('Should throw error when entity not found', async () => {
      const entity = new StubEntity({ name: 'other name', price: 10 });

      await expect(sut.update(entity)).rejects.toThrow(
        new NotFoundError('Entity not found'),
      );
    });

    it('Should update an entity', async () => {
      const entity = new StubEntity({ name: 'other name', price: 10 });

      await sut.insert(entity);

      const updateEntity = new StubEntity(
        { name: 'new name', price: 50 },
        entity.id,
      );

      await sut.update(updateEntity);

      expect(updateEntity.toJSON()).toStrictEqual(sut.items[0].toJSON());
    });
  });
});
