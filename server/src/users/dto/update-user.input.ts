import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType, ArgsType } from '@nestjs/graphql';
import { Optional } from '@nestjs/common';
import { Contains, IsEmail, IsNumber } from 'class-validator';

@InputType()
@ArgsType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsNumber()
  @Field(() => Int, { description: 'id of the user' })
  id: number;

  @IsEmail()
  @Contains('@zefir.fr')
  @Optional()
  @Field(() => String, { description: 'email of the user' })
  email?: string;

  @Optional()
  @Field(() => Int, { description: 'Result of fibonaci for the user' })
  fib?: number;
}
