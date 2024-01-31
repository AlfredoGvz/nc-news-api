# Points of clarification

- Developer needs to add the files containing the environment variables in order
  to connect to the databases locally.
  Create two new .env files, one for your test data, another one for your development data.
  Name them as follow:

  .env.test
  will contain your test database environment variable: PGDATABASE=name_of_database_test
  .env.development
  will contain your developer database environment variable: PGDATABASE=name_of_database

  Remember to install dotenv to be able to set up your environment variables. You can use
  the following command on your terminal: npm i dotenv --save

  Once these files are created, remember to add them to the gitignore. These two .env files
  may contain information that we do not wish to leave out there in the open.

# Cloning this project

- You can clone this repository by clicking on code, then copying the HTTPS link.
  On your computer, open your terminal and select the path you with to clone the repo into.
  Then type: git clone (paste the link you just copied)
  The repository will clone and you will be able to use it.

# The project

- Link to the hosted version: https://north-star-articles.onrender.com/api

  This proyect is still in the innitial phase. I have created an application tha is capable of communicating
  with a server and retrieve information from a data base. You can get access to the different pieces
  of information through the available endpoints.

- In the event you want to get a copy of this project, there will be a couple of packages you going to
  need to install in order to be able to run the server, format the information to seed your database
  and run the tests. I leave down below a list of the packages needed to get this show on the road!

  1- This project makes use of node-postgres. To be able to interfacing with your PostgreSQL database
  install pg: npm install pg
  For more information about node-postgres, you can access the following link:
  https://node-postgres.com/

  2- You will need to set up your environment variables. The next package to install will allow you
  to set them up: npm install dotenv

  3- This project seeds the databases from JSON files. You will find the files within the development-data
  and test-data in the data directory. To be able to seed your database install the following package:
  npm install pg-format
  For more information about pg-format you can access the following link:
  https://www.npmjs.com/package/pg-format

  4- This project has an express server set up, to be able to make requests to the server, install express:
  npm install express.

  5- For testing, this project mkaes use of jest, which is a JavaScript testing framework. You can install it
  using the follwing command: npm install jest
  For more information about the usage of jest, click the following link: https://jestjs.io/

  6- There are two custom matchers used to test some of the endpoints, they require a package called jest sorted
  Use the following command to install it: npm install jest-sorted

  # Creating and seeding database

  Reminder: Before seeding your databases, remember to create the environment variables as explained
  in the 'Points of clarification' section.
  Open your terminal and go to the location the repository was cloned into. Follow the next steps.

  1- To create the database type on your terminal the following command: npm run setup-dbs
  The database and tables are going to be created right after executing this command.

  2- To seed the database run the following command on the terminal: npm run seed

  3- If you want to deploy your verison of this work, you need to run the command npm run seed-prod

  # Requirements

  As of the moment of creation of this project, I am runing Node.js v21.2.0 and PostgreSQL v16.1

  # API Reference
  GET /api
  GET /api/articles
  GET /api/topics
  
  
