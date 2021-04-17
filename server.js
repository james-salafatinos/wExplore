//Express server management
const express = require("express");
const app = express();
const port = 8080;
const bodyParser = require("body-parser");

const { spawn } = require("child_process");

//Required for environment variables
require("dotenv").config();

// here you set that all templates are located in `/views` directory

//Express config for enabling templating engine to serve html
app.set("view engine", "ejs");

//@Route Home Page Route
app.get("/", (req, res) => {
  console.log("User entry to site...");
  res.status(200);
  res.sendFile(__dirname + "/network");
  console.log("User's desired wikipedia page...: ", req.query);

  let validate_req = function (req) {
    if (req.query.new_graph) {
      check_val = req.query.new_graph;
      if (check_val.length > 3) {
        console.log(check_val);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  if (validate_req(req)) {
    // spawn new child process to call the python script
    const process = spawn("python", ["./utils/main.py", req.query.new_graph]);

    // collect data from script
    process.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    // in close event we are sure that stream is from child process is closed
    process.on("close", (code) => {
      console.log(`child process close all stdio with code ${code}`);
    });
  } else {
    console.log("No python scripts to be run");
  }
});

//Express config to enable the model serving of static javascript file
app.use(express.static(__dirname + "/network"));
app.use(express.static(__dirname + "/public/"));

//Necessary to utilize db api service
app.use(bodyParser.json({ limit: "50mb" }));
//Use body parser to enable handling post requests
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//@Route Router for DB & profiles
let api = require("./routes/api");
app.use("/api", api);

//Listening with a link
app.listen(port, () => {
  console.log(`wExplore app listening at http://localhost:${port}`);
});
