import { Module } from '@nestjs/common';
import { AnagramsService } from './anagrams.service';
import { AnagramsResolver } from './anagrams.resolver';

@Module({
  providers: [AnagramsResolver, AnagramsService]
})
export class AnagramsModule {}
