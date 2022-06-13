import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  createUser(
    @Body()
    body: CreateUserDto,
  ) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('signin')
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }

  @Get(':id')
  findUser(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.usersService.findOne(id);
  }

  @Get()
  findAllUsers(email: string) {
    return this.usersService.findAll(email);
  }

  @Delete(':id')
  removeUser(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe)
    id: number,
    @Body()
    body: UpdateUserDto,
  ) {
    return this.usersService.update(id, body);
  }
}
