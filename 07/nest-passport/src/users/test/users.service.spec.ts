import { UsersService } from '../users.service';
import { Test } from '@nestjs/testing';
import {
  getRepositoryToken,
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Role, User } from '../entities/user.entity';
import { NestApplication } from '@nestjs/core';
import { Repository } from 'typeorm';
import dbConfig from '../../config/database';

describe('users.service', () => {
  let app: NestApplication;
  let service: UsersService;
  let repository: Repository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...dbConfig(),
          database: ':memory:',
        } as TypeOrmModuleOptions),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    service = module.get(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should return user by username', async () => {
      const user = new User();
      user.username = 'John';
      user.role = Role.ADMIN;
      await repository.save(user);

      const result = await service.findOne('John');
      expect(result).toEqual({
        id: 1,
        username: 'John',
        role: 'admin',
        password: null,
        refreshToken: null,
      });
    });
  });

  describe('create', () => {
    it('should create new user', async () => {
      const result = await service.create('Maria');
      expect(result).toHaveProperty('username', 'Maria');

      const entity = await repository.findOneBy({ username: 'Maria' });
      expect(entity).toEqual(result);
    });
  });
});
