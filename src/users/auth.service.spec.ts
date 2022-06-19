/* eslint-disable prettier/prettier */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService Tests', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      findAll: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 9999), email, password };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can Create an Instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a User with a Salted and hashed password', async () => {
    const user = await service.signup('rand@rand.com', 'hhhhh');

    expect(user.password).not.toEqual('hhhhh');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.findAll = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '22' }]);

    await expect(service.signup('yyx@xox.com', 'qwer')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error if signin is called with an invalid email', async () => {
    await expect(service.signin('wxww@ww.com', 'qwdr')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws error with invalid password', async () => {
    fakeUsersService.findAll = () =>
      Promise.resolve([{ email: 'a', password: '22' } as User]);
    await expect(service.signin('asx@gm.com', 'wxppr')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Returs a user, if correct password is provided', async () => {
    // fakeUsersService.findAll = () =>
    //   Promise.resolve([{ email: 'a', password: '22' } as User]);
    await service.signup('assse@jjk.com', 'password');

    const user = await service.signin('assse@jjk.com', 'password');
    expect(user).toBeDefined();
  });
});
