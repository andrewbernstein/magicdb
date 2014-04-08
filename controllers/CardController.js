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
		rawCardsCollection.find({ "printings.cardSetId" : ucaseName },
								{ printings: { $elemMatch: { cardSetId : ucaseName } },
								  name: 1, convertedManaCost:1, manaCost: 1, description: 1, type: 1, subtype: 1,
								  power: 1, toughness: 1 }
		).toArray(function(err, results) {
			results.sort(function(a, b) {
				if(a.printings[0].setNumber < b.printings[0].setNumber) {
					return -1;
				}
				return 1;
			});
			callback(results, callback);
		})
	});
}
exports.getSet = getSet;