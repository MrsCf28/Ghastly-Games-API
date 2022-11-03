# Ghastly Games Reviews API

### To see the hosted app please visit [Ghastly Games Reviews](https://ghastly-games-reviews.herokuapp.com/api)
With the simple endpoint /api you will be to view the API documentation. In Google Chrome, this would be best viewed using a JSON formatter Chrome Extension such as [this one](https://github.com/callumlocke/json-formatter).


<br />

## Background

Ghastly Games Reviews is designed to mimic the building of a real world backend service which should then provide this information to the front end architecture. Please have a look at the above app hosted on [Heroku](https://www.heroku.com/) which can accept API requests such as GET, POST, PATCH and DELETE to the Ghastly Games databases.
This project has been based on the premise of building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

The database is in PSQL, and has been interacted with by using [node-postgres](https://node-postgres.com/).

<br />

## Creating a Local Copy

### 1. Clone the repo

    $ git clone https://github.com/MrsCf28/nc-games.git
    $ cd nc-games

<br />

### 2. Install dependencies

    $npm install

<br />

### 3. Create dotenv files

In the main directory, create two files

     .env.development
     .env.test

and insert the relevant, corresponding data into each, as below

    PGDATABASE=[your_database_name_here]            // into .env.development
    PGDATABASE=[your_test_database_name_here]       // into .env.test

This will connect the databases.

Be aware you may need to configure your PostgreSQL password here. 

<br />

### 4. Seed the local database

Run both of the following scripts,

    $ npm run setup-dbs
    $ npm run seed

<br />

### 5. Run tests

    $ npm test

<br />

### 6. Run application

Start the server listening with:

    $ npm start

<br />


This project was created using:

    $ node -v | v18.7.0
    $ psql -V | 14.5

Now you should be able to use the application and run the associated tests on your local machine.






