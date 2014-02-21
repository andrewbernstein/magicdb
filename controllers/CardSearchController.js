var MongoService = require('../services/MongoService');

var formatCardsForMultipleReturn = function(results, callback) {
	var formattedResults = [];
	for(var cKey in results) {
		var card = results[cKey];
		card.printings = [ card.printings[card.printings.length - 1] ];
		formattedResults.push(card);
	}
	callback(formattedResults);
}

var formatResultsForSingleReturn = function(results, callback) {

}

var cardSearch = function(query, callback) {
	console.log(query);
	MongoService.connect(function(db) {
		var rawCardsCollection = db.collection('cards');
		rawCardsCollection.find({ tags: query }).toArray(function(err, results) {
			formatCardsForMultipleReturn(results, callback);
		})
	});
}
exports.cardSearch = cardSearch;

var advancedCardSearch = function(options, callback) {

}
exports.advancedCardSearch = advancedCardSearch;