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

// let query = `SHOW TABLES`;
let query = "INSERT INTO `user` (`id`, `username`, `email`, `password`) VALUES ?"; // Here, ? expects bulk insertion format i.e [[[], [], []]]
let users = [
  ['a', 'abc', 'abc@gmail.com', 'abc@123'],
  ['b', 'bcd', 'bcd@gmail.com', 'bcd@123']
];

try {
  connection.query(query, [users], (err, results) => { //Asynchronous (Doesn't block the execution)
    if (err) throw err;
    console.log(results);
    if (results.length > 0) {
      console.log(`Total results = ${results.length}`)
      for (let result of results) {
        console.log(result);
      }
    }
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