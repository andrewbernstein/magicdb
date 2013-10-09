var MongoService = require('../services/MongoService');

var cardSearch = function(query, callback) {
	MongoService.connect(function(db) {
		var rawCardsCollection = db.collection('rawCards');
		rawCardsCollection.find({ tags: query }).toArray(function(err, results) {
			callback(results);
		})
	});
}
exports.cardSearch = cardSearch;

var advancedCardSearch = function(options, callback) {

}
exports.advancedCardSearch = advancedCardSearch;