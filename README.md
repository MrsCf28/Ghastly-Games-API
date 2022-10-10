# Northcoders House of Games API

## Background

This project has been based on the premise of building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database is in PSQL, and has been interacted with by using [node-postgres](https://node-postgres.com/).

## Creating a Local Copy

### 1. Clone the repo

    `$ git clone https://github.com/MrsCf28/nc-games.git`
    `$ cd nc-games`
    `$ code .`

<br />

### 2. Install dependencies

    `$npm install`
    `$npm install express`
    `$npm install supertest`

<br />

### 3. Create dotenv files

In the main directory, create two files

    ` .env.development`
    ` .env.test`

and insert the relevant, corresponding data into each, as below

for development:

    `PGDATABASE=nc_games`

for test:

    `PGDATABASE=nc_games_test`

This will connect the databases.

<br />

### 4. Seed the local database

Run both of the following scripts,

    `$ npm run setup-dbs`
    `$ npm run seed`

<br />
Now you should be able to use the application and run the associated tests on your local machine.






