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
