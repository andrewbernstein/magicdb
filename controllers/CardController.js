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
		var cardsCollection = db.collection('cards');
		cardsCollection.find({ lcaseName: lcaseName }, standardIncludes).toArray(function(err, results) {
			callback(results, callback);
		})
	});
};
exports.getCard = getCard;

//this is probably super resource intensive to execute
var getSet = function(setName, callback) {
	MongoService.connect(function(db) {
		var ucaseName = setName.toUpperCase();
		var cardsCollection = db.collection('cards');
		printingIncludes.printings = { $elemMatch: { cardSetId : ucaseName } };
		cardsCollection.find({ "printings.cardSetId" : ucaseName }, printingIncludes).toArray(function(err, results) {
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

//get a random card from the database
//results are strangely consistent if you don't have an index on random
var getRandomCard = function(callback) {
	MongoService.connect(function(db) {
		var cardsCollection = db.collection('cards');
		var random = Math.random();
		console.log(random);

		result = cardsCollection.findOne({ random : { $gte : random } }, standardIncludes, function(err, results) {
			if(!results) {
				cardsCollection.findOne({ random: { $lte: random }}, standardIncludes, function(err, results) {
					callback(results);
				});
			}
			else {
				callback(results);
			}
		});
	});
};
exports.getRandomCard = getRandomCard;