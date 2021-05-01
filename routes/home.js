const bodyParser = require("body-parser");
const express = require("express");
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ limit: "10mb" }));
const dotenv = require("dotenv");
var path = require("path");
const DatasetObject = require("../models/datasetObject.model");
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const fs = require("fs");

var path = require("path");
const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("Connected to db"))
  .catch((err) => console.log("Error on connection with mongodb...", err));

const wikipedia_scrape = function (wikipedia_topic) {
  console.log("In Wikipedia scrape function with ", wikipedia_topic);
  console.log(
    "Wikipedia Scrape path",
    path.resolve(__dirname, "..", "utils/main.py")
  );
  // spawn new child process to call the python script
  const process = spawn("/usr/local/bin/python3", [
    path.resolve(__dirname, "..", "utils/main.py"),
    wikipedia_topic,
  ]);
  console.log("Process:", process)

  // collect data from script
  process.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  // in close event we are sure that stream is from child process is closed
  process.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);

    if (code == 0){
        fs.readFile("./network/data.json", "utf8", (err, jsonString) => {
            if (err) {
            console.log("File read failed:", err);
            return;
            }
            let title = JSON.parse(jsonString).nodes[0]["label"];
            console.log("Title submitted to mongo", title);
            let datasetObject = { title: title, datasetObject: jsonString };
            DatasetObject.create(datasetObject, function (err, result) {
            if (err) {
                console.log("Could not reach Mongo's DB API");
                console.log(err);
            } else {
                console.log(
                `Saved payload to MongoDB with _id: ${JSON.stringify(result._id)}`
                );
            }
            });
        });



    }




  });
};

//@Route Home Page Route
router.get("/", (req, res) => {
  //Test: Machine Learning 607c6a2ed4378255b8a15085
  console.log("User entry to site...");
  console.log("User's desired wikipedia page...: ", req.query);

  if (req.query.new_graph) {
    console.log("In query");
    //If exists, redirect, otherwise, perform add
    let title = req.query.new_graph;
    DatasetObject.find({ title: title }, function (error, data) {
      console.log("after dataset object");
      //console.log("Found the data..., ", data);
      if (data.length > 0) {
        res.status(200);
        res.redirect("/api/" + data[0]["_id"]);
      } else {
        let validate_req = function (req) {
          if (req.query.new_graph) {
            check_val = req.query.new_graph;
            if (check_val.length > 3) {
              console.log("Validated query: ", check_val);
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        };

        if (validate_req(req)) {
          console.log("About to Scrape...");
          wikipedia_scrape(req.query.new_graph);

          res.redirect("../");
        } else {
          console.log("No python scripts to be run.");
        }
      }
    }).catch((err) => console.log(err));
  } else {
    console.log("In else");
    res.status(200);
    res.sendFile(path.resolve(__dirname + "/../network"));
  }
});

module.exports = router;
