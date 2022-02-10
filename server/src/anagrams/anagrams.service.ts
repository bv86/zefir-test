import { Injectable } from '@nestjs/common';
import { CreateAnagramInput } from './dto/create-anagram.input';
import { UpdateAnagramInput } from './dto/update-anagram.input';

@Injectable()
export class AnagramsService {
  create(createAnagramInput: CreateAnagramInput) {
    return 'This action adds a new anagram';
  }

  findAll() {
    return `This action returns all anagrams`;
  }

  findOne(id: number) {
    return `This action returns a #${id} anagram`;
  }

  update(id: number, updateAnagramInput: UpdateAnagramInput) {
    return `This action updates a #${id} anagram`;
  }

  remove(id: number) {
    return `This action removes a #${id} anagram`;
  }
}
