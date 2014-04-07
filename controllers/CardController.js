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

//this is probably super resource intensive to execute
var getSet = function(setName, callback) {
	MongoService.connect(function(db) {
		var ucaseName = setName.toUpperCase();
		var rawCardsCollection = db.collection('cards');
		rawCardsCollection.find({ "printings.card_set_id" : ucaseName },
								{ printings: { $elemMatch: { card_set_id: ucaseName } },
								  name: 1, convertedmanacost:1, manacost: 1, description: 1, type: 1, subtype: 1,
								  power: 1, toughness: 1 }
		).toArray(function(err, results) {
			results.sort(function(a, b) {
				if(a.printings[0].set_number < b.printings[0].set_number) {
					return -1;
				}
				return 1;
			});
			callback(results, callback);
		})
	});
}
exports.getSet = getSet;