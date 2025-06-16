import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Photo } from './photo.schema';
import mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Photo' }] })
  photos: Photo[];
}

export const UserSchema = SchemaFactory.createForClass(User);
