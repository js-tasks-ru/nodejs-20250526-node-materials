import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateTaskInput } from './create-task.input';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  @Field(() => Int, { description: 'ID редактируемой задачи' })
  id: number;
}
