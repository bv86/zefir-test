import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnagramInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
