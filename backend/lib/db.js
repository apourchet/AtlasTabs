var BigRedDb = exports = module.exports;

// Sample mongodb usage
var Db = require("mongodb").Db;
var Server = require("mongodb").Server;
var mongoHost = "localhost";
var mongoPort = "27017";
var dbName = "bigred";
var collectionName = "testColl";
var db = new Db(dbName, new Server(mongoHost, mongoPort), {safe: false});

BigRedDb.insertData = function(data, cb) {
    db.open(function(err, db) {
	    if(err) { return console.log(err); }
	    console.log("Connected to database " + dbName + "!");
	
	    var collection = db.collection(collectionName);
	    collection.insert({data: data, createdAt: new Date().getTime()}, function(){
            db.close();
            cb()
        });
    });
}

BigRedDb.getTrending = function(params, cb) {
    db.open(function(err, db) {
    	if(err) { return console.log(err); }
    	console.log("Connected to database " + dbName + "!");
    	
    	var collection = db.collection(collectionName);
    	collection.find().toArray(function(err, items) {
    		db.close();
            // cb(items);
            cb(["www.reddit.com", "www.facebook.com", "www.gmail.com", "test.google.com", "priceline.negociator.edu"])
    	});
    });
}

BigRedDb.init = function(app) {
    console.log("Initializing BigRedDb!");
    app.post('/api/ping', function(req, res) {
        res.send({error: 0, pong: 1})
    });
    
    app.post('/api/update', function(req, res) {
        BigRedDb.insertData(req.body.data, function() {
            res.send({error: 0})
        });
    });
    
    app.get('/api/trending', function(req, res) {
        BigRedDb.getTrending(req.body.params, function(urls){
            res.send({error:0, urls:urls});
        });
    });
}

