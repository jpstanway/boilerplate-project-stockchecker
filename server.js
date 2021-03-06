"use strict";

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const expect = require("chai").expect;
const cors = require("cors");
const helmet = require("helmet");

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

const app = express();

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //For FCC testing purposes only

// set content security policies
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://code.jquery.com/jquery-2.2.1.min.js",
        "https://code.jquery.com/jquery-3.3.1.slim.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js",
        "https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js"
      ],
      imgSrc: ["'self'", "https://hyperdev.com/favicon-app.ico"]
    }
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type("text")
    .send("Not Found");
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function() {
  console.log("Listening on port " + process.env.PORT);
  if (process.env.NODE_ENV === "test") {
    console.log("Running Tests...");
    setTimeout(function() {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log("Tests are not valid:");
        console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
