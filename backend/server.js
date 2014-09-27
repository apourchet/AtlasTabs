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
	console.log("Middleware here!");
	if (!req.session.counter) {
		req.session.counter = 0;
	}
	req.session.counter++;
	console.log("Session counter: " + req.session.counter);
	next();
});

// Sample endpoint use
app.get("/debug", function(req, res) {
	res.end("Bare express application");
});

app.post('/ping', function(req, res) {
    res.send({error: 0})
});

app.get('/trending', function(req, res) {
    res.send({error:0, urls:["www.reddit.com", "www.facebook.com", "gmail.com"]});
});

// Sample mongodb usage
// var Db = require("mongodb").Db;
// var Server = require("mongodb").Server;
// var mongoHost = "localhost";
// var mongoPort = "27017";
// var dbName = "test";
// var collectionName = "blankexpress";
// var db = new Db(dbName, new Server(mongoHost, mongoPort), {safe: false});
// 
// db.open(function(err, db) {
// 	if(err) { return console.log(err); }
// 	console.log("Connected to database " + dbName + "!");
// 	
// 	var collection = db.collection(collectionName);
// 	collection.insert({name: "Sample document", createdAt: new Date().getTime()}, function(err, res) {
// 	});
// 
// 	collection.find().toArray(function(err, items) {
// 		console.log(collectionName + " has " + items.length + " documents");
// 		db.close();
// 	});
// });

var server = app.listen(constants.port, function() {
  console.log('Listening on port %d', server.address().port);
});
