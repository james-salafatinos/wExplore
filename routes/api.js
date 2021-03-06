const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ limit: "10mb" }));

const DatasetObject = require("../models/datasetObject.model");

router.get("/", function (req, res) {
  //Collects all the route names and presents it
  let info = [];
  router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
      info.push(r.route.path);
    }
  });
  res.status(200).send(info);
});

//Add the current data.json to mongo
router.get("/add-record", (req, res) => {
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
        res.status(502);
        console.log(err);
      } else {
        console.log(
          `Saved payload to MongoDB with _id: ${JSON.stringify(result._id)}`
        );
        //This sends a notification back to the CLIENT that the database load was successful!
        // res.redirect(`/api/${result._id}`);
        res.send("200");
      }
    });
  });
});

//Go to graph by uuid
router.get("/:uuid", (req, res) => {
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
      // res.redirect("../");
      res.redirect("back");
    })
    .catch((err) => console.log(err));
});

//Present all titles in the database
router.get("/find/all-records-titles", (req, res) => {
  DatasetObject.find(
    {},
    {
      _id: 1,
      title: 1,
      createdAt: 1,
    },
    { sort: { createdAt: -1 } },
    function (error, data) {
      // ids is an array of all ObjectIds
      // console.log(data.slice(0, 3));
      res.send(data.slice(0, 50));
    }
  );
});

router.get("/find/by-title/:title", (req, res) => {
  console.log("Requested title: ", req.params);
  let title = req.params.title;
  DatasetObject.find(
    { title: title },
    {
      _id: 1,
      title: 1,
    },
    function (error, data) {
      res.status(200);
      // ids is an array of all ObjectIds
      res.send(data);
    }
  ).catch((err) => console.log(err));
});

router.get("/find/:uuid", (req, res) => {
  //test ID: 607c62e0589b014d6c77f250 Mark Lowry
  console.log("Requested: ", req.params);
  let uuid = req.params.uuid;
  DatasetObject.findById(uuid)
    .then((result) => {
      //   res.send(result);
      let payload = result.datasetObject;
      res.status(200);
      res.send(payload);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
