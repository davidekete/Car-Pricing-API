import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Session,
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

  @Get('whoami')
  whoAmI(@Session() session: any) {
    return this.usersService.findOne(session.userId);
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Post('signup')
  async createUser(
    @Body()
    body: CreateUserDto,
    @Session()
    session: any,
  ) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(
    @Body() body: CreateUserDto,
    @Session()
    session: any,
  ) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
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
