import { UpdateUserUseCaseInput } from '../../application/useCases/update-user.use-case';

export class UpdateUserDto implements Omit<UpdateUserUseCaseInput, 'id'> {
  name: string;
}
