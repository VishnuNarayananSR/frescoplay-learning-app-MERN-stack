const express = require("express");
const usersRouter = require("./routers/users");
require("./mongoose/db/mongoose");

//setting up the express server
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());
app.use(usersRouter);

module.exports = app;
