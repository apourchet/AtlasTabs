var BigRedDb = exports = module.exports;

// Sample mongodb usage
var Db = require("mongodb").Db;
var Server = require("mongodb").Server;
var mongoHost = "localhost";
var mongoPort = "27017";
var dbName = "bigred";
var collectionName = "testColl";
var serverOptions = {
        'auto_reconnect': true,
        'poolSize': 5
};
var db = new Db(dbName, new Server(mongoHost, mongoPort, serverOptions), {safe: false});


BigRedDb.getDatabase = function(cb) {
    db.open(function(err, db) {
        db.authenticate('api', 'apipass', function(err, result) {
            if(err) { return console.log(err); }
            cb(db, function() {
                db.close();
            });
        });
    });
}

BigRedDb.insertData = function(data, cb) {
    BigRedDb.getDatabase(function(db, endF) {
	
	    var collection = db.collection(collectionName);
	    collection.insert({data: data, createdAt: new Date().getTime()}, function(err, item){
            cb()
            endF()
        });
    });
}

BigRedDb.getTrending = function(params, cb) {
    BigRedDb.getDatabase(function(db, endF) {
    	
    	var collection = db.collection(collectionName);
    	collection.find().limit(5).toArray(function(err, items) {
            // cb(items);
            cb(["www.reddit.com", "www.facebook.com", "www.gmail.com", "test.google.com", "priceline.negociator.edu"])
            endF();
    	});
    });
}

BigRedDb.getSuggestions = function(params, cb) {
    BigRedDb.getDatabase(function(db, endF) {
    	
    	var collection = db.collection(collectionName);
    	collection.find({userId: params.userId}).limit(5).toArray(function(err, items) {
            // cb(items);
            cb(["www.reddit.com", "www.facebook.com", "www.gmail.com", "test.google.com", "priceline.negociator.edu"])
            endF();
    	});
    });
}

BigRedDb.init = function(app) {
    console.log("Initializing BigRedDb!");
    app.get('/api/newId', function(req, res) {
        console.log("/api/newId");
        // TODO
        res.send({error: 0, userId: Math.random()})
    });

    app.post('/api/ping', function(req, res) {
        console.log("/api/ping");
        res.send({error: 0, pong: 1})
    });

    app.get('/api/suggest', function(req, res) {
        console.log("/api/suggest");
        BigRedDb.getSuggestions(req.param("options"), function(urls) {
            res.send({error:0, urls:urls});
        });
    });
    
    app.post('/api/update', function(req, res) {
        console.log("/api/update");
        BigRedDb.insertData(req.body.data, function() {
            res.send({error: 0})
        });
    });
    
    app.get('/api/trending', function(req, res) {
        console.log("/api/trending");
        BigRedDb.getTrending(req.body.options, function(urls){
            res.send({error:0, urls:urls});
        });
    });
}

