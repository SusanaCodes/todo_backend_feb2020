const serverlessHttp = require("serverless-http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "Tasks",
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", function (request, response) {
  // Should make a SELECT * FROM Tasks query to the DB and return the results
  connection.query("SELECT * FROM Tasks", function (err, data) {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send(data);
    }
  });
});

app.delete("/tasks/:id", function (request, response) {
  const id = request.params.id;
  const query = "DELETE FROM Tasks WHERE TaskId = ?";
  connection.query(query, [id], (err) => {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send("Task successfully deleted!");
    }
  });
});

app.post("/tasks", function (request, response) {
  const data = request.body;
  // SQL Injection - avoid this by "escaping" user-provided values
  const query = `INSERT INTO Tasks (Description, DueDate, Completed, Urgent) VALUES (?,?,?,?)`;
  connection.query(
    query,
    [data.Description, data.DueDate, false, data.Urgent],
    function (err, results) {
      if (err) {
        console.log("Error from MySQL", err);
        response.status(500).send(err);
      } else {
        connection.query(
          `SELECT * FROM Tasks WHERE TaskId = ${results.insertId}`,
          function (err, results) {
            if (err) {
              console.log("Error from MySQL", err);
              response.status(500).send(err);
            } else {
              response.status(201).send(results[0]);
            }
          }
        );
      }
    }
  );
});

app.put("/tasks/:id", function (request, response) {
  const id = request.params.id;
  const data = request.body;
  const query = "UPDATE Task SET? WHERE TaskId=?";
  connection.query(query, [data, id], (err) => {
    if (err) {
      console.log("Error from MySQL", err);
      response.status(500).send(err);
    } else {
      response.status(200).send("Task successfully updated!");
    }
  });
});

module.exports.app = serverlessHttp(app);
