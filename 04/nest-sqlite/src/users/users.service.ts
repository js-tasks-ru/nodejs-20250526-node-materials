import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  list() {
    return this.usersRepository.find({
      select: {
        name: true,
        email: true,
        photos: true,
      },
      relations: ['photos'],
    });
  }

  async create(body: any) {
    const photo = new Photo();
    photo.url = `http://images.com/${Date.now()}.jpeg`;
    await this.photosRepository.save(photo);

    const user = new User();
    user.name = body.name;
    user.email = body.email;
    user.photos = [photo];
    await this.usersRepository.save(user);

    return user;
  }

  delete(id: string) {
    return this.usersRepository.delete(id);
  }
}
