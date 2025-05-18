const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'app',
  password: process.env.PASSWORD
});

try {
    connection.query("SHOW TABLES", (err, results) => { //Asynchronous (Doesn't block the execution)
        if(err) throw err;
        console.log(results);
    });
} catch (err) {
    console.log(err);
}

connection.end();

let createRandomUser = () => {
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(), // before version 9.1.0, use userName()
    email: faker.internet.email(),
    password: faker.internet.password()
  };
}

console.log(createRandomUser());