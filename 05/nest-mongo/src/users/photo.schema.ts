import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Photo {
  @Prop()
  url: string;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
