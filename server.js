var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
var app = express();
var bodyParser = require("body-parser");

// Mongoose mpromise deprecated - use bluebird promises
var Promise = require("bluebird");
mongoose.Promise = Promise;

var Unit = require('./config/models/unit');
const units = require('./config/routes/units');
const randunits = require('./config/routes/randunits');
const selectteam = require('./config/routes/selectteam');

// const players = require('./api/routes/players');

//This gets the units' JSON info from http://localhost:8080/units
app.use('/', units);
app.use('/', randunits);
app.use('/', selectteam);

var PORT = process.env.PORT || 8080;

require('./webpack.config.js');

app.use(express.static(process.cwd() + "/public") );

//Use body-parser to generate JSON content
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

var databaseUri = "mongodb://localhost/jaguar";
//var MONGODB_URI = require('./keys.js');

//Option whether to connect to remote server or localhost
if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(databaseUri);
}

// Database configuration with mongoose
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
	console.log("Mongoose connection successful.");
});

app.listen(PORT, function() {
	console.log('App listening on PORT ' + PORT);
});