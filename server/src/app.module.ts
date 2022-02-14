import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AnagramsModule } from './anagrams/anagrams.module';
import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      subscriptions: {
        'subscriptions-transport-ws': {
          path: '/subscriptions'
        },
      }
    }),
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
      type: 'postgres',
      host: process.env['POSTGRES_HOST'] ?? 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'WhyNo78Yet?',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true
    }),
    UsersModule,
    AnagramsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
