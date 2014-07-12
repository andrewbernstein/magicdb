var MongoService = require('../services/MongoService');

var formatCardsForMultipleReturn = function(results, callback) {
	var formattedResults = [];
	for(var cKey in results) {
		var card = results[cKey];
		card.printings = [ card.printings[card.printings.length - 1] ];
		formattedResults.push(card);
	}
	callback(null, formattedResults);
}

var formatResultsForSingleReturn = function(results, callback) {

}

var cardSearch = function(query, callback) {
	MongoService.connect(function(db) {
		var queryParts = query.split(' ');
		var dbQuery = [];
		for(var qKey in queryParts) {
			dbQuery.push({tags: queryParts[qKey]});
		}
		var rawCardsCollection = db.collection('cards');
		rawCardsCollection.find({$and: dbQuery}).toArray(function(err, results) {
			if(err) {
				return callback(err, null);
			}
			formatCardsForMultipleReturn(results, callback);
		})
	});
}
exports.cardSearch = cardSearch;

var advancedCardSearch = function(options, callback) {

}
exports.advancedCardSearch = advancedCardSearch;