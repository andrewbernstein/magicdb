var MongoService = require('./../services/MongoService');
var config = require('config');
var Keywords = require('./KeywordsController');

var importCards = function() {
	var importedCards = [];
	var importedSets = [];
	MongoService.connect(function(db) {
		var rawCardsCollection = db.collection('rawCards');
		var cardsCollection = db.collection('cards');
		var setsCollection = db.collection('sets');
		var cards = require('../' + config.functions.cardFile);
		for(var i in cards) {
			var card = cards[i];
			//if we haven't seen this set before, insert it in to the database
			if(importedSets.indexOf(card.card_set_id) == -1) {
				upsertSet(setsCollection, card.card_set_name, card.card_set_id);
				importedSets.push(card.card_set_id);
			}

			//add/update card to the raw card collection
			upsertRawCard(rawCardsCollection, card);

			//if we haven't seen this card before (same name is same card), upsert the base card in to the db
			if(importedCards.indexOf(card.name) == -1) {
				upsertCard(cardsCollection, card);
				importedCards.push(card.name)
			}
			//if we've seen the card, add another printing to it
			else {
				addPrintingToCard(cardsCollection, card);
			}
		}
	});
}
exports.importCards = importCards;

var upsertCard = function(dbCollection, card) {
	formatCard(card);
	dbCollection.update({ name: card.name }, { $set: card }, { upsert: true, safe: true }, function(err, docs) {
		//console.log('format imported set ' + card.printings[0].card_set_id + ' card ' + card.name);
	});
}

var upsertRawCard = function(dbCollection, card) {
	dbCollection.update({ Id: card.Id }, { $set: card }, { upsert: true, safe: true }, function(err, docs) {
		//console.log('raw imported set ' + card.card_set_id + ' card ' + card.name);
	});
}

var addPrintingToCard = function(dbCollection, card) {
	var printing = getPrinting(card);
	dbCollection.update({ name: card.name }, { $push: { printings: printing }}, { safe: true }, function(err) {
		if(err) {
			console.log(err);
		}
		else {
			//console.log('added set ' + printing.card_set_id + ' to card ' + card.name);
		}
	});
}

var upsertSet = function(dbCollection, name, abbreviation) {
	var set = { name: name, abbreviation: abbreviation };
	dbCollection.update({ name: name }, { $set : set }, { upsert: true, safe: true }, function(err, docs) {
		//console.log('added set ' + name + ' to database');
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

	updateSetAbbreviation(printing);

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
	card.tags.push(card.manacost.toLowerCase());

	//add the colors of the card to tags
	for(var cKey in card.colors) {
		card.tags.push(card.colors[cKey].toLowerCase());
	}
}