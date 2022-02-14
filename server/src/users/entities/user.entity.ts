import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'id of the user' })
  id: number;

  @Column({ unique: true })
  @Field(() => String, { description: 'email of the user' })
  email: string;

  /* Using float as return type because GraphQL Int is 32bit and too small */
  @Column('bigint')
  @Field(() => Float, { description: 'Result of fibonaci for the user', })
  fib: number;
}
