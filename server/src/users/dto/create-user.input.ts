import { InputType, Field, ArgsType } from '@nestjs/graphql';
import { Contains, IsEmail } from 'class-validator';

@InputType()
@ArgsType()
export class CreateUserInput {
  @IsEmail()
  @Contains('@zefir.fr')
  @Field(() => String, { description: 'email of the user' })
  email: string;
}
