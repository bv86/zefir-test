import { CreateAnagramInput } from './create-anagram.input';
import { InputType, Field, Int, PartialType, ArgsType } from '@nestjs/graphql';
import { IsJSON, IsNumber, IsOptional } from 'class-validator';

@InputType()
@ArgsType()
export class UpdateAnagramInput extends PartialType(CreateAnagramInput) {

  @IsNumber()
  @Field(() => Int, { description: 'id of the anagram' })
  id: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { description: 'id of user' })
  user_id?: number;

  @IsJSON()
  @IsOptional()
  @Field(() => String, { description: 'json serialized map object' })
  anagram_map?: string;
}
