import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  list() {
    return this.users;
  }

  get(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`user with id ${id} not found`);
    return user;
  }

  create(data) {
    const user = {
      id: data.id,
      name: data.name,
    };
    this.users.push(user);
    return user;
  }

  modify(id: string, data) {
    const user = this.get(id);
    user.name = data.name;
    return user;
  }

  delete(id: string) {
    const user = this.get(id);
    this.users = this.users.filter((u) => u.id !== id);
    return user;
  }
}
