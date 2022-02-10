import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from '../../users';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@ObjectType()
@Entity()
export class Anagram {
  
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int, { description: 'id of the anagram' })
  id: number;

  @Column()
  @Field(() => Int, { description: 'id of user' })
  user_id: number;

  @Column()
  @Field(() => String, { description: 'json serialized map object' })
  anagram_map: string;

  @OneToOne(() => User, {primary: true, cascade: true}) @JoinColumn({name: 'user_id'}) 
  user: User;
}
