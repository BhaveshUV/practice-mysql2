const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

//----------------------------faker pkg----------------------------//

let createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password()
  ];
}

//----------------------------mysql2 pkg----------------------------//

dotenv.config();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'app',
  password: process.env.PASSWORD
});

//--------------------------express.js srv--------------------------//

const server = express();
server.listen(8080, () => {
  console.log("The server has started listening for requests...");
});
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "/views"));

// For all requests:
// use static files(for stylesheets, js, images) from /public
server.use(express.static(path.join(__dirname, "/public")));
// use middlewares(for processing request before route handlers to parse it)
// middleware—parse URL-encoded form data (from HTML forms)
server.use(express.urlencoded({ extended: true }));
server.use(methodOverride("_method"));

// GET — Home Route
server.get("/", (req, res) => {
  try {
    connection.query("SELECT COUNT(DISTINCT id) FROM user WHERE id IS NOT NULL", (err, results) => {
      if (err) throw err;
      let totalUsers = results[0]["COUNT(DISTINCT id)"];
      console.log(results, totalUsers);
      res.render("home.ejs", { totalUsers });
    });
  } catch (err) {
    res.send("Error: " + err);
  }
});

// GET — All Users Route (Cards form)
server.get("/users", (req, res) => {
  try {
    connection.query("SELECT id, username, email FROM user", (err, results) => {
      if (err) throw err;
      // results –> array of objects/rows
      res.render("users.ejs", { users: results });
    });
  } catch (err) {
    res.send(err);
  }
});

// GET — All Users Route (Tabular form)
server.get("/users-tabular", (req, res) => {
  try {
    connection.query("SELECT id, username, email FROM user", (err, results) => {
      if (err) throw err;
      // results –> array of objects/rows
      res.render("usersTabular.ejs", { users: results });
    });
  } catch (err) {
    res.send(err);
  }
});

// GET — Edit Username Route
server.get("/users/:id", (req, res) => {
  console.log("get request triggered...")
  let { id } = req.params;
  console.log(id);
  try {
    connection.query("SELECT * FROM user WHERE id = ?", [[`${id}`]], (err, result) => {
      if (err) throw err;
      console.log("Form to edit user --> ", result);
      res.render("editUser.ejs", { user: result[0] });
    });
  } catch (err) {
    res.send("Error: " + err);
  }
});

// UPDATE — Patch/update Username Route
server.patch("/users/:id", (req, res) => {
  console.log("req.body --> ", req.body);
  try {
    connection.query("SELECT password FROM user WHERE id = ?", [req.params.id], (err, result) => {
      if (err) throw err;
      else if (req.body.password != result[0].password) res.send("Incorrect Password!");
      else {
        connection.query("UPDATE user SET username = ? WHERE id = ? AND password = ?", [req.body.username, req.params.id, req.body.password], (err, result) => {
          if (err) throw err;
          console.log(result);
          res.redirect("/users");
        });
      }
    });
  } catch (err) {
    res.send("Error: " + err);
  }
});