var BigRedDb = exports = module.exports;

var Utils = require("./utils")
var QHelper = require("./queryhelper")

// Sample mongodb usage
var Db = require("mongodb").Db;
var Server = require("mongodb").Server;
var mongoHost = "localhost";
var mongoPort = "27017";
var dbName = "bigred";
var collectionName = "browsingData";
var serverOptions = {
        'auto_reconnect': true,
        'poolSize': 10
};
var db = new Db(dbName, new Server(mongoHost, mongoPort, serverOptions), {safe: false});
var database = undefined

BigRedDb.getDatabase = function(cb) {
    if (database) {
        return cb(database, function(){});
    }
    db.open(function(err, db) {
        db.authenticate('api', 'apipass', function(err, result) {
            if(err) { return console.log(err); }
            return cb(db, function() {
                db.close();
            });
        });
    });
}

BigRedDb.getDatabase(function(db){
    console.log("Got the db!");
    database = db
});

BigRedDb.insertData = function(data, cb) {
    BigRedDb.getDatabase(function(db, endF) {
	    var collection = db.collection(collectionName);
	    console.log("Inserting in " + collectionName)
        var newData = Utils.reformatData(data)
	    collection.insert({data: data, createdAt: new Date().getTime()}, function(err, item){
            if (err) console.log(err)
            cb()
            endF()
        });
    });
}

BigRedDb.getTrending = function(params, cb) {
    BigRedDb.getDatabase(function(db, endF) {
    	
    	var collection = db.collection(collectionName);
    	collection.find().limit(5).toArray(function(err, items) {
            var valids = Utils.curateUrls(items[0].data.URLs)
            cb(valids)
            // cb(["www.reddit.com", "www.facebook.com", "www.gmail.com", "test.google.com", "priceline.negociator.edu"])
            endF();
    	});
    });
}

BigRedDb.getSuggestions = function(params, cb) {
    BigRedDb.getDatabase(function(db, endF) {
    	
    	var collection = db.collection(collectionName);
    	collection.find({"data.userId":params.userId}).sort({ createdAt: -1 }).limit(1).toArray(function(err, items) {
            // Do stuff here
            var urls = Utils.curateUrls(items[0].data.URLs);
            cb(urls);
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
    
    app.get('/api/trending', function(req, res) {
        console.log("/api/trending");
        BigRedDb.getTrending(req.param("options"), function(urls){
            res.send({error:0, urls:urls});
        });
    });

    app.post('/api/update', function(req, res) {
        console.log("/api/update");
        BigRedDb.insertData(req.body.data, function() {
            res.send({error: 0})
        });
    });
    
    
}

