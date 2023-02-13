import express from "express";
import mysql from "mysql";
import { Task } from "./models/Task.js";
import { createTaskQuery, getTasksQuery } from "./queries.js";

const app = express();
const port = 3000;

app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "node_tasks_api",
});

connection.connect(function (err) {
  if (err) console.log("error connecting to database");
  console.log("connection to the database successful");
});

app.post("/tasks", (req, res, next) => {
  try {
    const newTask = req.body;
    const newTaskModel = new Task(newTask);

    newTaskModel.validate();

    connection.query(createTaskQuery(newTask), (err, result) =>
      newTaskModel.createCallback(err, result, res)
    );
  } catch (error) {
    next(error);
  }
});

app.get("/tasks", (req, res, next) => {
  const taskModel = new Task();
  try {
    connection.query(getTasksQuery, (err, result) =>
      taskModel.getCallback(err, result, res)
    );
  } catch (error) {
    next(error);
  }
});

// error handler
app.use((error, req, res, next) => {
  res.status(error.status_code).json({ error });
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
