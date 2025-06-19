import { UpdatePasswordUseCaseInput } from '../../application/useCases/update-password.use-case';

export class UpdatePasswordDto
  implements Omit<UpdatePasswordUseCaseInput, 'id'>
{
  oldPassword: string;
  newPassword: string;
}
