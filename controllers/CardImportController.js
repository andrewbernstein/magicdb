var MongoService = require('./../services/MongoService');
var config = require('config');
var Keywords = require('./KeywordsController');

var importCards = function() {
	var importedCards = [];
	MongoService.connect(function(db) {
		var rawCardsCollection = db.collection('rawCards');
		var cards = require('../' + config.functions.cardFile);
		for(var i in cards) {
			var card = cards[i];
			if(importedCards.indexOf(card.name) == -1) {
				updateCard(rawCardsCollection, card);
				importedCards.push(card.name)
			}
			else {
				addSet(rawCardsCollection, card);
			}
		}
	});
}
exports.importCards = importCards;

var updateCard = function(collection, card) {
	formatCard(card);
	collection.update({ name: card.name }, { $set: card }, { upsert: true, safe: true }, function(err, docs) {
		console.log('imported set ' + card.printings[0].card_set_id + ' card ' + card.name);
	});
}

var addSet = function(collection, card) {
	var printing = getPrinting(card);
	collection.update({ name: card.name }, { $push: { printings: printing }}, { safe: true }, function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log('added set ' + printing.card_set_id + ' to card ' + card.name);
		}
	});
}

var printingAttributes = [
	'Id',
	'artist',
	'card_image',
	'card_set_name',
	'card_set_id',
	'flavor',
	'rarity',
	'released_at',
	'set_number'
];

var getPrinting = function(card) {
	var printing = {};

	for(var pKey in printingAttributes) {
		var pAttribute = printingAttributes[pKey];
		printing[pAttribute] = card[pAttribute];
	}

	return printing;
}

var deletePrintingInformation = function(card) {
	for(var pKey in printingAttributes) {
		var pAttribute = printingAttributes[pKey];
		delete card[pAttribute];
	}
}

var formatCard = function(card) {
	//lowercase the name, type, description, and rarity for easier searching
	card.lcaseName = card.name.toLowerCase();
	card.lcaseType = card.type.toLowerCase();
	card.lcaseDescription = card.description.toLowerCase();

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
		card.tags.push(splitName[nameKey]);
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
	card.tags.push(card.manacost.toLowerCase());

	//add the colors of the card to tags
	for(var cKey in card.colors) {
		card.tags.push(card.colors[cKey].toLowerCase());
	}
}