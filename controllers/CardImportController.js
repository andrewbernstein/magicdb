var MongoService = require('./../services/MongoService');
var config = require('config');
var Keywords = require('./KeywordsController');
var async = require('async');

var importCards = function() {
	var importedCards = [];
	var importedSets = [];
	MongoService.connect(function(db) {
		var rawCardsCollection = db.collection('rawCards');
		var cardsCollection = db.collection('cards');
		var setsCollection = db.collection('sets');
		var cards = require('../' + config.functions.cardFile);
		console.log('finished reading card json');

		//blow away all existing cards and sets to start to prevent potential data corruption issues
		async.parallel([
			function(callback) {
				cardsCollection.remove(callback);
			},
			function(callback) {
				setsCollection.remove(callback);
			},
			function(callback) {
				rawCardsCollection.remove(callback);
			}
		]);

		var count = 0;
		var cardsToInsert = [];
		for(var i in cards) {
			var aCard = cards[i];
			//creating a closure here to avoid any conflicts with the card variable
			(function(card) {
				cardsToInsert.push(function(callback) {
					//as it turns out, the steps below are independent of each other, so we can do them in parallel!
					async.parallel([
						function(callback) {
							//if we haven't seen this set before, insert it in to the database
							if(importedSets.indexOf(card.cardSetId) == -1) {
								importedSets.push(card.cardSetId);
								upsertSet(setsCollection, card.cardSetName, card.cardSetId, callback);
							}
							else {
								callback();
							}
						},
						function(callback) {
							//add/update card to the raw card collection
							upsertRawCard(rawCardsCollection, card, callback);
						},
						function(callback) {
							//set up a general callback for counting results to be used in both cases below
							var theCallback = function(err, results) {
								if(++count % 100 == 0) {
									console.log('Imported ' + count + ' cards');
								}
								callback();
							};

							//if we haven't seen this card before (same name is same card), upsert the base card in to the db
							if(importedCards.indexOf(card.name) == -1) {
								importedCards.push(card.name);
								upsertCard(cardsCollection, card, theCallback);
							}
							//if we've seen the card, add another printing to it
							else {
								addPrintingToCard(cardsCollection, card, theCallback);
							}
						}
					], callback);
				});
			})(aCard);
		}
		console.log('Finished staging card inserters, total cards found:', cardsToInsert.length);
		async.parallelLimit(cardsToInsert, 100, function(err, results) {
			if(err) {
				console.error(err);
			}
			else {
				console.log("Finished importing cards!");
			}
			process.exit();
		})
	});
}
exports.importCards = importCards;

var upsertCard = function(dbCollection, card, callback) {
	formatCard(card);
	dbCollection.update({ name: card.name }, { $set: card }, { upsert: true, safe: true }, callback);
}

var upsertRawCard = function(dbCollection, card, callback) {
	dbCollection.update({ id: card.id }, { $set: card }, { safe: true }, callback)
}

var addPrintingToCard = function(dbCollection, card, callback) {
	var printing = getPrinting(card);
	dbCollection.update({ name: card.name }, { $push: { printings: printing }}, { safe: true }, callback);
}

var upsertSet = function(dbCollection, name, abbreviation, callback) {
	var set = { name: name, abbreviation: abbreviation };
	dbCollection.update({ name: name }, { $set : set }, { upsert: true, safe: true }, callback);
}

var printingAttributes = [
	'id',
	'artist',
	'cardSetName',
	'cardSetId',
	'flavor',
	'rarity',
	'releasedAt',
	'setNumber'
];

var getPrinting = function(card) {
	var printing = {};

	for(var pKey in printingAttributes) {
		var pAttribute = printingAttributes[pKey];
		printing[pAttribute] = card[pAttribute];
	}

	printing = updateSetAbbreviation(printing);

	return printing;
}

var deletePrintingInformation = function(card) {
	for(var pKey in printingAttributes) {
		var pAttribute = printingAttributes[pKey];
		delete card[pAttribute];
	}
}

/*
	For some reason, mtgdb.info's set abbreviations (the card_set_id) don't match the gatherer set abbreviations
	(I think because mtgdb.info wants all abbreviations to have three characters, not all gatherer ones do),
	so update the set abbreviations to match gatherer's.
 */
var updateSetAbbreviation = function(printing) {
	var setReplacements = Keywords.getSetReplacements();
	if(setReplacements.hasOwnProperty(printing.card_set_id)) {
		printing.card_set_id = setReplacements.hasOwnProperty(printing.card_set_id);
	}
	return printing;
}

var formatCard = function(card) {
	//lowercase the name, type, description, and rarity for easier searching
	card.lcaseName = card.name.toLowerCase();
	card.lcaseType = card.type.toLowerCase();
	card.lcaseDescription = card.description.toLowerCase();

	//add a random field for getting a random card from the database
	//idea is from http://stackoverflow.com/questions/2824157/random-record-from-mongodb (second solution)
	card.random = Math.random();

	//pull out values that are not unique to this printing of the card and put them in arrays
	card.printings = [];

	var printing = getPrinting(card);
	card.printings.push(printing);
	deletePrintingInformation(card);

	//start assembling the tags
	card.tags = [];

	//put the name in to the tags
	var splitName = card.lcaseName.split(' ');
	for(var nameKey in splitName) {
		var namePart = splitName[nameKey];

		//put the base name in to tags
		card.tags.push(namePart);

		//strip out commas so "Elspeth" ends up in the tags for "Elspeth, Sun's Champion"
		namePart = namePartnamePart = namePart.replace(/,/g, '');
		card.tags.push(namePart);

		/*
		//attempt to deal with plurals
		if(namePart[namePart.length - 1] == 's') {
			//there are a lot of elves, let's make it easier to search for them
			if(namePart == 'elves') {
				card.tags.push('elf');
			}
			else {
				card.tags.push(namePart.slice(0, namePart.length - 1));
			}
		}
		*/
	}

	//if the description contains an ability, push it in to the tags
	var abilities = Keywords.getAbilities();
	for(var aKey in abilities) {
		var ability = abilities[aKey].toLowerCase();
		if(card.lcaseDescription.indexOf(ability) != -1) {
			card.tags.push(ability);
		}
	}

	//add the manacost to tags
	card.tags.push(card.manaCost.toLowerCase());

	//add the colors of the card to tags
	for(var cKey in card.colors) {
		card.tags.push(card.colors[cKey].toLowerCase());
	}
}