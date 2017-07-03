var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var PLEDGES_COLLECTION = "pledges";

var app = express();
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// PLEDGES API ROUTES BELOW
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/pledges"
 *    GET: finds all pledges
 *    POST: creates a new pledge
 */

app.get("/api/pledges", function(req, res) {
  db.collection(PLEDGES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get pledges.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/pledges", function(req, res) {
  var newPledge = req.body;

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  }

  db.collection(PLEDGES_COLLECTION).insertOne(newPledge, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new pledge.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

/*  "/api/pledges/:id"
 *    GET: find pledges by id
 *    PUT: update pledges by id
 *    DELETE: deletes pledges by id
 */

app.get("/api/pledges/:id", function(req, res) {
});

app.put("/api/pledges/:id", function(req, res) {
});

app.delete("/api/pledges/:id", function(req, res) {
});
