//import express from "express" is only for React, as they use the most modern JS
//React apps get Transpiled
//This version of NodeJS does support statements and there is no transpilation step


const serverlessHttp = require ("serverless-http");
const express = require ("express");
const cors = require ("cors");
const bodyParser = require ("body-parser");

//Logically separate 4 sections of code according to the method of HTTP request received.

// Export a single function, called app

const app = express();
app.use(cors());
app.use (bodyParser.json());



app.get("/tasks", function (request, response) {
    // Should make a SELECT * FROM Tasks query to the DB and return the results

    response.status(200).send({
        tasks:[
          {
            id: 1,
            text : "Clean car"
          }, 
          {
            id: 2,
            text : "Do Js homework"
          },
        ],
    });
});

app.delete("/tasks/:id", function (request, response) {
  const id = request.params.id;
    response.status(200).send(`Deleted task with ID ${id}!`)
});

/*THIS IS THE REQUEST BODY
{
	"text": "Wash the dog",
	"dataDue": "2020-04-24",
	"urgent": true
} */

app.post("/tasks", function (request, response) {
  const data = request.body;
// Should INSERT INTO the database the new task

    response.status(200).send(`New task of ${data.text} created!`);
});

app.put("/tasks/:id", function (request, response) {
  const id = request.params.id;
  const data = request.body;
//Should UPDATE a task in the DB

    response
      .status(200)
      .send(`Updated task with ID ${id} and data ${JSON.stringify(data)}`);
});

module.exports.app = serverlessHttp(app);