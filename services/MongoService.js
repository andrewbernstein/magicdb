var MongoClient = require('mongodb').MongoClient;
var config = require('config');

var theConnection = null;

var connect = function(callback) {
    if(!theConnection) {
        //theConnection = new Mongo(getConnectionString());
        MongoClient.connect(getConnectionString(), function(err, db) {
            if(err) {
                throw err;
            }
            else {
                theConnection = db;
                callback(theConnection);
            }
        })
    }
    else {
        callback(theConnection);
    }
}
exports.connect = connect;

var getConnectionString = function() {
    return 'mongodb://' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database;
}