import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Controller,
  Inject,
  HttpCode,
  Query,
  Put,
} from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SignUpUseCase } from '../application/useCases/sign-up.use-case';
import { SignInUseCase } from '../application/useCases/sign-in.use-case';
import { UpdateUserUseCase } from '../application/useCases/update-user.use-case';
import { UpdatePasswordUseCase } from '../application/useCases/update-password.use-case';
import { DeleteUserUseCase } from '../application/useCases/delete-user.use-case';
import { ListUsersUseCase } from '../application/useCases/list-users.use-case';
import { GetUserUseCase } from '../application/useCases/get-user.use-case';
import { SignInDto } from './dtos/sign-in.dto';
import { ListUsersDto } from './dtos/list-users.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('users')
export class UsersController {
  @Inject(SignUpUseCase)
  private signUpUseCase: SignUpUseCase;

  @Inject(SignInUseCase)
  private signInUseCase: SignInUseCase;

  @Inject(UpdateUserUseCase)
  private updateUserUseCase: UpdateUserUseCase;

  @Inject(UpdatePasswordUseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase;

  @Inject(GetUserUseCase)
  private getUserUseCase: GetUserUseCase;

  @Inject(DeleteUserUseCase)
  private deleteUserUseCase: DeleteUserUseCase;

  @Inject(ListUsersUseCase)
  private listUsersUseCase: ListUsersUseCase;

  @Post()
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.signUpUseCase.execute(signUpDto);
  }

  @HttpCode(200)
  @Post('/login')
  async login(@Body() signInDto: SignInDto) {
    return await this.signInUseCase.execute(signInDto);
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return await this.listUsersUseCase.execute(searchParams);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getUserUseCase.execute({ id });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.updateUserUseCase.execute({ id, ...updateUserDto });
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.updatePasswordUseCase.execute({
      id,
      ...updatePasswordDto,
    });
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({ id });
  }
}
