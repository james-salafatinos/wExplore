//Express server management
const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");

const { spawn } = require("child_process");

//Required for environment variables
require("dotenv").config();

//Database setup

const mongoose = require("mongoose");
const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("Connected to db"))
  .catch((err) => console.log("Error on connection with mongodb...", err));

//Express config for enabling templating engine to serve html
app.set("view engine", "ejs");

//@Route home
let home = require("./routes/home");
app.use("/", home);

//@Route api
let api = require("./routes/api");
app.use("/api", api);

//Express config to enable the model serving of static javascript file
app.use(express.static(__dirname + "/network"));
app.use(express.static(__dirname + "/public/"));

//Necessary to utilize db api service
app.use(bodyParser.json({ limit: "50mb" }));
//Use body parser to enable handling post requests
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//Listening with a link
app.listen(port, () => {
  console.log(`wExplore app listening at http://localhost:${port}/`);
});
