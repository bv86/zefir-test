import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnagramsService } from './anagrams.service';
import { Anagram } from './entities/anagram.entity';
import { CreateAnagramInput } from './dto/create-anagram.input';
import { UpdateAnagramInput } from './dto/update-anagram.input';

@Resolver(() => Anagram)
export class AnagramsResolver {
  constructor(private readonly anagramsService: AnagramsService) {}

  @Mutation(() => Anagram)
  createAnagram(@Args('createAnagramInput') createAnagramInput: CreateAnagramInput) {
    return this.anagramsService.create(createAnagramInput);
  }

  @Query(() => [Anagram], { name: 'anagrams' })
  findAll() {
    return this.anagramsService.findAll();
  }

  @Query(() => Anagram, { name: 'anagram' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.anagramsService.findOne(id);
  }

  @Mutation(() => Anagram)
  updateAnagram(@Args('updateAnagramInput') updateAnagramInput: UpdateAnagramInput) {
    return this.anagramsService.update(updateAnagramInput.id, updateAnagramInput);
  }

  @Mutation(() => Anagram)
  async removeAnagram(@Args('id', { type: () => Int }) id: number) {
    const anagram = await this.anagramsService.remove(id);
    return Object.assign(anagram, {id});
  }
}
