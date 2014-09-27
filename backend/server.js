#! /usr/local/bin/node

// Get command line arguments
var args = process.argv;

// Get constants
var fs = require('fs');
var constants = JSON.parse(fs.readFileSync('resources/constants.json', 'utf8'));
Object.freeze(constants);

// Setup express stuff and things
var express = require("express");
var app = express();

app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded());

// Using cookie-based sessioning. Kind of bad but not really
app.use(express.cookieParser());
app.use(express.cookieSession({
	key: constants.session.cookie.key,
	secret: constants.session.secret,
	cookie: {
    maxAge: constants.session.cookie.maxAge
  }
}));

// Sample middleware and session use
app.use(function(req, res, next) {
	// console.log("Middleware here!");
	if (!req.session.counter) {
		req.session.counter = 0;
	}
	req.session.counter++;
	// console.log("Session counter: " + req.session.counter);
	next();
});

// Sample endpoint use
app.get("/debug", function(req, res) {
	res.end("Bare express application");
});

var BigRedDb = require("./lib/db");
BigRedDb.init(app);

var server = app.listen(constants.port, function() {
  console.log('Listening on port %d', server.address().port);
});
