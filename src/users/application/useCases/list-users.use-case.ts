import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from '../../../shared/application/dtos/pagination-output.dto';
import { SearchInputDto } from '../../../shared/application/dtos/search-input.dto';
import { UseCase } from '../../../shared/application/useCases/use-case';
import {
  SearchParams,
  SearchResult,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { UserOutputMapper } from '../dtos/user-output.dto';

export type ListUsersUseCaseInput = SearchInputDto;

export type ListUsersUseCaseOutput = PaginationOutputDto;

export class ListUsersUseCase
  implements UseCase<ListUsersUseCaseInput, ListUsersUseCaseOutput>
{
  constructor(private userRepository: UserRepository) {}

  async execute(input: ListUsersUseCaseInput): Promise<ListUsersUseCaseOutput> {
    const params = new SearchParams(input);
    const searchResult = await this.userRepository.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: SearchResult): ListUsersUseCaseOutput {
    const items = searchResult.items.map((item) =>
      UserOutputMapper.toOutput(item),
    );
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
