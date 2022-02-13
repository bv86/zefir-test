import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { AnagramsService } from '../anagrams/anagrams.service';
import { Anagram } from '../anagrams';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Anagram]),
  ],
  providers: [UsersResolver, UsersService, AnagramsService],
})
export class UsersModule {}
