import { Injectable } from '@nestjs/common';
import { User } from './user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Photo } from './photo.schema';

mongoose.set('debug', true);

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Photo.name) private photoModel: Model<Photo>,
  ) {}

  async list() {
    const users = await this.userModel.find().populate('photos');
    return users;
  }

  async create(data: any) {
    const photo = await this.photoModel.create({
      url: `http://images.com/${Date.now()}.jpeg`,
    });

    const user = await this.userModel.create({
      name: data.name,
      email: data.email,
      photos: [photo],
    });
    return user;
  }

  async delete(userId) {
    const user = await this.userModel.findByIdAndDelete(userId);
    return user;
  }
}

/*
 * authors: [{id: 1, name: "Darya", surname: "Dontsova"}]
 * books: [
 *  {title: "Red Flowers", author: 1, publisher: {title: "Eksmo", city: "Moscow"},
 *  {title: "Blue Ocean", author: 1, publisher: {title: "Eksmo", city: "Moscow"},
 * ]
 * */
