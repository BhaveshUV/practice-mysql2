const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const dotenv = require('dotenv');

let createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password()
  ];
}

dotenv.config();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'app',
  password: process.env.PASSWORD
});

// let query = `SHOW TABLES`;
let query = "INSERT INTO `user` (`id`, `username`, `email`, `password`) VALUES ?"; // Here, ? expects bulk insertion format i.e [[[], [], []]]
let data = [];
for(let i=1; i<=100; i++) {
  data.push(createRandomUser());
}

try {
  connection.query(query, [data], (err, results) => { //Asynchronous (Doesn't block the execution)
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