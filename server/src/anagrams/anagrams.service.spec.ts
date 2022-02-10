import { Test, TestingModule } from '@nestjs/testing';
import { AnagramsService } from './anagrams.service';

describe('AnagramsService', () => {
  let service: AnagramsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnagramsService],
    }).compile();

    service = module.get<AnagramsService>(AnagramsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
