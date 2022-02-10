import { CreateAnagramInput } from './create-anagram.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnagramInput extends PartialType(CreateAnagramInput) {
  @Field(() => Int)
  id: number;
}
