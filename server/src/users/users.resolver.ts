import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { AnagramsService } from 'src/anagrams/anagrams.service';
import { fastFibonacci, fibonacci, getRandomNumber, writeAnagramsFile } from '../tools';
import { createReadStream, existsSync, readFile, unlinkSync } from 'fs';
import { Anagram } from '../anagrams';
import { v4 as uuidv4 } from 'uuid';
import { mapSync, split } from 'event-stream';
import { PubSub } from 'graphql-subscriptions';

// not suited for production according to the documentation
const pubSub = new PubSub();

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly anagramsService: AnagramsService,
  ) {}

  /**
   * Reads anagram file and return anagram map
   * @param path the path to the file with anagrams
   * @returns the map with word => anagrams count
   */
  async readAndGenerateMap(path: string): Promise<{ [keys: string]: number }> {
    const anagrams: { [keys: string]: number } = {};
    return new Promise((resolve, reject) => {
      const s = createReadStream(path)
        .pipe(split())
        .pipe(
          mapSync(function (line) {
            if (line.length == 0) return;
            s.pause();
            const chars = line.split('');
            const word = chars.sort().join('');
            if (word in anagrams) {
              anagrams[word]++;
            } else {
              anagrams[word] = 0;
            }
            s.resume();
          }),
        )
        .on('error', function (err) {
          console.log('Error while reading file.', err);
          reject(err);
        })
        .on('end', function () {
          console.log('Read entire file.');
          resolve(anagrams);
        });
    });
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const random = getRandomNumber(50, 51);
    /** Using a better version of the fibonacci series */
    const fib = await fastFibonacci(random);
    const input = Object.assign(createUserInput, { fib });
    /** Generate a random, temporary file name */
    const uuid = uuidv4();
    const path = `/tmp/${uuid}`;
    console.log(`Will save temporary anagrams to ${path}`);
    try {
      /** This also takes a long time and not necessary to calculate the anagram count */
      await new Promise((resolve, reject) => {
        try {
          writeAnagramsFile(60, path, resolve);
        } catch (err) {
          reject(err);
        }
      });
      /** We read the file */
      const map = await this.readAndGenerateMap(path);
      const mapString = JSON.stringify(map);
      console.log(`The map is ${mapString}`);
      const user = await this.usersService.create(input).catch(async (err) => {
        // if we have an error, maybe the user was already created
        // retrieve the existing instance?
        const users = await this.usersService.findAll({
          where: {
            email: input.email,
          },
        });
        if (users.length == 1) {
          return users[0];
        } else {
          throw err;
        }
      });
      // if we are here, the user was created or already existed
      // in the latter case, we need to try to create the anagram entry just in case
      await this.anagramsService
        .create({
          user_id: user.id,
          anagram_map: mapString,
        })
        .catch(() => {
          // the anagram already existed, so throw an error
          throw new Error(`The user with email ${input.email} already exists`);
        });
      // so that all clients can update their data
      pubSub.publish('userAdded', { userAdded: user });
      return user;
    } catch (err) {
      throw err;
    } finally {
      if (existsSync(path)) unlinkSync(path);
    }
  }

  @Subscription(() => User)
  userAdded() {
    return pubSub.asyncIterator('userAdded');
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    const user = await this.usersService.remove(id);
    return Object.assign(user, {
      id,
    });
  }

  @ResolveField('anagram', () => Anagram)
  async anagram(@Parent() user: User) {
    const { id } = user;
    const anagram = await this.anagramsService.findAll({
      where: { user_id: id },
    });
    return anagram[0];
  }
}
