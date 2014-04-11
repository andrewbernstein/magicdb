var MongoService = require('../services/MongoService');

//a set of standard include card values to return from the database for explicitness
var standardIncludes = {
	name: 1,
	convertedManaCost:1,
	manaCost: 1,
	description: 1,
	type: 1,
	subtype: 1,
	power: 1,
	toughness: 1,
	printings: 1
};

//cloning the standard includes and adding a printings elemMatch for getting cards that match a given printing set
var printingIncludes = JSON.parse(JSON.stringify(standardIncludes));
printingIncludes['printings'] = { $elemMatch: { cardSetId : '' }};

var getCard = function(cardName, callback) {
	MongoService.connect(function(db) {
		var lcaseName = cardName.toLowerCase();
		var rawCardsCollection = db.collection('cards');
		rawCardsCollection.find({ lcaseName: lcaseName }, standardIncludes).toArray(function(err, results) {
			callback(results, callback);
		})
	});
};
exports.getCard = getCard;

//this is probably super resource intensive to execute
var getSet = function(setName, callback) {
	MongoService.connect(function(db) {
		var ucaseName = setName.toUpperCase();
		var rawCardsCollection = db.collection('cards');
		printingIncludes.printings = { $elemMatch: { cardSetId : ucaseName } };
		rawCardsCollection.find({ "printings.cardSetId" : ucaseName }, printingIncludes).toArray(function(err, results) {
			results.sort(function(a, b) {
				if(a.printings[0].setNumber < b.printings[0].setNumber) {
					return -1;
				}
				return 1;
			});
			callback(results, callback);
		})
	});
};
exports.getSet = getSet;