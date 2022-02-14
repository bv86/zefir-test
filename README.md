# The Zefir technical test

Here is my implementation of the test. Required components:

- a backend (using nest.js + GraphQL + Postgres)
- a frontend (using react.js + next.js + Apollo client)

I'm starting the test with little to no knowledge of GraphQL, nest.js, next.js and Apollo.
I know typescript, node.js and react.js.

Since we'll need a PostgresSQL database, let's start with this.

## The database

I'll use docker-compose to setup a local database.

## The server

I bootstrapped a nest.js application using the nestjs cli with the following command:

    nest new server

Now, I need to add resources and setup the database in nest.js.

I'll use the cli again for the barebone entity files I need and use typeorm for the database. I also need to setup GraphQL.

For GraphQL, I'll follow the quickstart tutorial from nest.js <https://docs.nestjs.com/graphql/quick-start>

## The frontend

I used the cli to bootstrap a next.js application.

I did not do something fancy, on the contrary, it's not styled and most components are in the same file.

## What I did not do

- write tests
- merged the server part of next.js into the `server` project (apparently possible using nest-next library)
- the pubsub implementation used here is not suited for production according to nestjs documentation
- subscription is done only for added users and not for removed/updated users
- migrations are in automatic mode, it would be better to manage them manually according to documentation
- for the anagram map, because the same word can be picked multiple times, the anagram count can be more than !10, not sure if that's ok

## testing

One can test the full stack using docker-compose:

    docker-compose up -d

Then, navigate to http://localhost:3000