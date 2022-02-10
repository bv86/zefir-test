# The Zefir technical test

Here is my implementation of the test. Required components:

- a backend (using nest.js + GraphQL + Postgres)
- a frontend (using react.js + next.js + Apollo client)

I'm starting the test with little to no knowledge of GraphQL, nest.js, next.js and Apollo.
I know typescript, node.js and react.js.

Since we'll need a PostgresSQL database, let's start with this.

## The database

I'll use docker-compose to setup a local database.

The `docker-compose.yml` is at the root of this project, and one can setup the database with the following command:

    docker-compose up -d

## The server

I bootstrapped a nest.js application using the nestjs cli with the following command:

    nest new server

Now, I need to add resources and setup the database in nest.js.

I'll use the cli again for the barebone entity files I need and use typeorm for the database. I also need to setup GraphQL.

For GraphQL, I'll follow the quickstart tutorial from nest.js <https://docs.nestjs.com/graphql/quick-start>



