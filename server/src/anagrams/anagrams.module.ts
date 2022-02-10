import { Module } from '@nestjs/common';
import { AnagramsService } from './anagrams.service';
import { AnagramsResolver } from './anagrams.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anagram } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Anagram])],
  providers: [AnagramsResolver, AnagramsService]
})
export class AnagramsModule {}
