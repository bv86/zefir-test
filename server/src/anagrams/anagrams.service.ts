import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateAnagramInput } from './dto/create-anagram.input';
import { UpdateAnagramInput } from './dto/update-anagram.input';
import { Anagram } from './entities';

@Injectable()
export class AnagramsService {

  constructor(@InjectRepository(Anagram) 
    private readonly anagramRepository: Repository<Anagram>) {
  }

  async create(createAnagramInput: CreateAnagramInput) {
    const anagram = this.anagramRepository.create(createAnagramInput);
    return await this.anagramRepository.save(anagram);
  }

  async findAll(options?: FindManyOptions<Anagram>) {
    return await this.anagramRepository.find(options);
  }

  async findOne(id: number) {
    const anagram = await this.anagramRepository.findOne(id);
    if (!anagram) {
      throw new NotFoundException(`Anagram #${id} not found`);
    }
    return anagram;
  }

  async update(id: number, updateAnagramInput: UpdateAnagramInput) {
    const anagram = await this.anagramRepository.preload({
      id,
      ...updateAnagramInput,
    });
    if (!anagram) {
      throw new NotFoundException(`Anagram #${id} not found`);
    }
    return this.anagramRepository.save(anagram);
  }

  async remove(id: number) {
    const anagram = await this.findOne(id);
    return this.anagramRepository.remove(anagram);
  }
}
