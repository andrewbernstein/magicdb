var MongoService = require('../services/MongoService');

var getAllSetsByReleaseDate = function(callback) {
	MongoService.connect(function(db) {
		var setsCollection = db.collection('sets');
		setsCollection.find().sort('releasedAt', 'desc').toArray(callback);
	});
};
exports.getAllSetsByReleaseDate = getAllSetsByReleaseDate;