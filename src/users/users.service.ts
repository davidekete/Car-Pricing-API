import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  async findOne(id: number): Promise<User> {
    if (!id) {
      return null;
    }
    try {
      const user = await this.repo.findOneByOrFail({ id });

      return user;
    } catch (error) {
      console.log(error);
    }
  }

  findAll(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attributes: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, attributes);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      console.log('wahala');
      throw new NotFoundException('User Not found');
    }

    return this.repo.remove(user);
  }
}
