import { InputType, Int, Field, ArgsType } from '@nestjs/graphql';
import { IsJSON, IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
@ArgsType()
export class CreateAnagramInput {
  @IsNumber()
  @Field(() => Int, { description: 'id of user' })
  user_id: number;

  @IsNotEmpty()
  @IsJSON()
  @Field(() => String, { description: 'json serialized map object' })
  anagram_map: string;
}
