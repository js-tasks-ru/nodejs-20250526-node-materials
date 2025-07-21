import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field({ description: 'Короткий заголовок задачи' })
  title: string;

  @Field({ description: 'Подробное описание', nullable: true })
  description?: string;
}
