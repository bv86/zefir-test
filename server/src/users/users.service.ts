import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities';

/**
 * Input required to create a user
 */
export interface FullUserInput extends CreateUserInput {

  /** Result of a fibonacci sequence */
  fib: number;
}

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) 
    private readonly userRepository: Repository<User>) {
  }

  async create(userInput: FullUserInput) {
    const user = this.userRepository.create(userInput);
    return await this.userRepository.save(user);
  }

  async findAll(options?: FindManyOptions<User>) {
    return await this.userRepository.find(options);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserInput,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
