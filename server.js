// config dotenv
require("dotenv").config();

const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const moment = require("moment");
const chalk = require("chalk");

// Configure passport
require("./config/passport");

const controllers = require("./controllers");

// SETUP DB


// SETUP SERVER
const PORT = process.env.PORT || 3001;
const app = express();

// ENABLE CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.static("public"));
app.use(controllers);

// Small verification route, mostly just so I can test if it's deployed/setup
app.get('/test', (req, res) => {
  res.send("active: " + Date.now().toString());
})

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));
