import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Task {
  @Field(() => ID, { description: 'Уникальный идентификатор задачи' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'Короткий заголовок задачи' })
  @Column()
  title: string;

  @Field({ description: 'Подробное описание', nullable: true })
  @Column({ nullable: true })
  description?: string;
}
