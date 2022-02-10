import { Test, TestingModule } from '@nestjs/testing';
import { AnagramsResolver } from './anagrams.resolver';
import { AnagramsService } from './anagrams.service';

describe('AnagramsResolver', () => {
  let resolver: AnagramsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnagramsResolver, AnagramsService],
    }).compile();

    resolver = module.get<AnagramsResolver>(AnagramsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
