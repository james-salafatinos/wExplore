const bodyParser = require("body-parser");
const express = require("express");
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ limit: "10mb" }));
var path = require("path");
// const DatasetObject = require("../models/datasetObject.model");
const { spawn } = require("child_process");
const fs = require("fs");
var path = require("path");
const environment = process.env.ENVIRONMENT;
console.log("Environment", environment);

const DatasetObject = require("../models/datasetObject.model");

//Figures out environment
let python_path = "/usr/local/bin/python3";
if (environment == "DEV") {
  python_path = "python";
} else {
  python_path = "/usr/local/bin/python3";
}

const wikipedia_scrape = function (wikipedia_topic) {
  console.log("In Wikipedia scrape function with ", wikipedia_topic);

  console.log(
    "Wikipedia Scrape path",
    path.resolve(__dirname, "..", "utils/main.py")
  );
  // spawn new child process to call the python script
  const process = spawn(python_path, [
    path.resolve(__dirname, "..", "utils/main.py"),
    wikipedia_topic,
  ]);

  // collect data from script
  process.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  // in close event we are sure that stream is from child process is closed
  process.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);

    // if (code == 0) {
    //   fs.readFile("./network/data.json", "utf8", (err, jsonString) => {
    //     if (err) {
    //       console.log("File read failed:", err);
    //       return;
    //     }
    //     let title = JSON.parse(jsonString).nodes[0]["label"];
    //     console.log("Title submitted to mongo", title);
    //     let datasetObject = { title: title, datasetObject: jsonString };
    //     DatasetObject.create(datasetObject, function (err, result) {
    //       if (err) {
    //         console.log("Could not reach Mongo's DB API");
    //         console.log(err);
    //       } else {
    //         console.log(
    //           `Saved payload to MongoDB with _id: ${JSON.stringify(result._id)}`
    //         );
    //       }
    //     });
    //   });
    // }
    if (code == 0) {
      console.log("Successfully executed python scripts");
    }
  });
};

var LAST_QUERY = "";

//@Route Home Page Route
router.get("/", (req, res) => {
  //Test: Machine Learning 607c6a2ed4378255b8a15085
  console.log("User entry to site...");
  console.log("User's desired wikipedia page...: ", req.query);

  if (LAST_QUERY != req.query || LAST_QUERY === "") {
    if (req.query.new_graph) {
      console.log("Client submitted a new graph query");
      //If exists, redirect, otherwise, perform add
      let title = req.query.new_graph;
      DatasetObject.find({ title: title }, function (error, data) {
        console.log(
          "From '/', I've been asked for a new graph, but I've found one in the database:",
          title
        );
        //console.log("Found the data..., ", data);

        //If the requested graph is in the DB, redirect them to that page
        if (data.length > 0) {
          res.status(200);
          res.redirect("/api/" + data[0]["_id"]);
        } else {
          //Otherwise, validate it's a legit query and scrape
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
            res.redirect("back");
          } else {
            console.log("Query is too short... No python scripts to be run.");
            res.status(400);
            res.send("400 Bad Request");
          }
        }
      }).catch((err) => console.log(err));
    } else {
      console.log("Client did not submit a new graph query");
      res.status(200);
      res.sendFile(path.resolve(__dirname + "/../network"));
    }
  }
});

module.exports = router;
