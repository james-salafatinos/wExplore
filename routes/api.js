const bodyParser = require("body-parser");
const express = require("express");
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ limit: "10mb" }));
const dotenv = require("dotenv");
var path = require("path");
const DatasetObject = require("../models/datasetObject.model");
const mongoose = require("mongoose");
const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log("Connected to db"))
  .catch((err) => console.log("Error on connection with mongodb...", err));

router.get("/", function (req, res) {
  res.status(200).send("Youve reached the API");
});

router.get("/add-record", (req, res) => {
  const fs = require("fs");
  fs.readFile("./network/data.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    let datasetObject = { datasetObject: jsonString };
    DatasetObject.create(datasetObject, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(
          `Saved payload to MongoDB with _id: ${JSON.stringify(result._id)}`
        );
        //This sends a notification back to the CLIENT that the database load was successful!
        res.redirect(`/api/${result._id}`);
      }
    });
  });
});

router.get("/:uuid", (req, res) => {
  //test ID: 607a21fac1d7cd0a3cc8afcb John Church
  //test ID: 607a2a421cdb014db82b7b17 Mark Lowry
  console.log("Requested: ", req.params);
  let uuid = req.params.uuid;
  DatasetObject.findById(uuid)
    .then((result) => {
      //   res.send(result);
      let payload = result.datasetObject;
      var fs = require("fs");
      fs.writeFile("./network/data.json", payload, function (err) {
        if (err) {
          console.log(err);
        }
      });
      res.status(200);
      res.redirect("../");
    })
    .catch((err) => console.log(err));
});

module.exports = router;
