var MongoService = require('../services/MongoService');

var getCard = function(cardName, callback) {
	MongoService.connect(function(db) {
		var lcaseName = cardName.toLowerCase();
		var rawCardsCollection = db.collection('cards');
		rawCardsCollection.find({ lcaseName: lcaseName }).toArray(function(err, results) {
			callback(results, callback);
		})
	});
}
exports.getCard = getCard;