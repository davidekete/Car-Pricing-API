import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'ss@ss.com', password: 'djdkdk' });
      },
      findAll: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'sss' }]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password });
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Finds all users', async () => {
    const users = await controller.findAllUsers('ss@ss.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('ss@ss.com');
  });

  it('finds a user with a given id', async () => {
    const user = await controller.findUser(1);
    expect(user).toBeDefined();
  });

  //this test is failing
  it('throws an error if user id is not found', async () => {
    fakeUsersService.findOne = (id: number) => null;
    await expect(controller.findUser(1)).rejects.toThrow(NotFoundException);
  });

  it('signs in, updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'asd@kk.com', password: 'ass' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
