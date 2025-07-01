import { UsersService } from '../users.service';
import { Repository } from 'typeorm';
import { User, Role } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';

const mockRepository = (): jest.Mocked<Partial<Repository<User>>> => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
});

describe('UsersService (mocked db)', () => {
  let service: UsersService;
  let repo: jest.Mocked<Partial<Repository<User>>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  describe('findOne', () => {
    it('should return user by username', async () => {
      const user = { id: 1, username: 'John', role: Role.ADMIN } as User;
      repo.findOneBy!.mockResolvedValue(user);

      const result = await service.findOne('John');
      expect(result).toEqual(user);
      expect(repo.findOneBy).toHaveBeenCalledWith({ username: 'John' });
    });

    it('should return null if not found', async () => {
      repo.findOneBy!.mockResolvedValue(null);
      const result = await service.findOne('Nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save new user', async () => {
      const savedUser = { id: 2, username: 'Maria', role: Role.USER } as User;
      repo.save!.mockResolvedValue(savedUser);

      const result = await service.create('Maria');
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ username: 'Maria' }),
      );
      expect(result).toEqual(savedUser);
    });
  });
});
