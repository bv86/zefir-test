import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Anagram } from '../../anagrams';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'id of the user' })
  id: number;

  @Column()
  @Field(() => String, { description: 'email of the user' })
  email: string;

  @Column('int')
  @Field(() => Int, { description: 'Result of fibonaci for the user' })
  fib: number;
}
