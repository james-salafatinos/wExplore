//Express server management
const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");

//Required for environment variables
require("dotenv").config();

//Express config for enabling templating engine to serve html
app.set("view engine", "ejs");
//Express config to enable the model serving of static javascript file
app.use(express.static(__dirname + "/network"));
app.use(express.static(__dirname + "/public/"));

//Necessary to utilize db api service
app.use(bodyParser.json({ limit: "50mb" }));
//Use body parser to enable handling post requests
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//@Route Home Page Route
app.get("/", (req, res) => {
  console.log("User entry to site...");
  res.status(200);
  res.render("index");
});

//Listening with a link
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
