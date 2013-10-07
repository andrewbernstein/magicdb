var MongoService = require('./../services/MongoService');
var config = require('config');
var Keywords = require('./KeywordsController');

var importCards = function() {
    MongoService.connect(function(db) {
        var rawCardsCollection = db.collection('rawCards');
        var cards = require('../' + config.functions.cardFile);
        for(var i in cards) {
            var card = cards[i];
            updateCard(rawCardsCollection, card);
        }
    });
}
exports.importCards = importCards;

var updateCard = function(collection, card) {
	formatCard(card);
	collection.update({ Id: card.Id }, card, { upsert: true }, function(err, docs) {
		console.log('imported card', card.name);
	});
}

var formatCard = function(card) {
	//lowercase the name, type, description, and rarity for easier searching
	card.lcaseName = card.name.toLowerCase();
	card.lcaseType = card.type.toLowerCase();
	card.lcaseDescription = card.description.toLowerCase();
	card.lcaseRarity = card.rarity.toLowerCase();

	//start assembling the tags
	card.tags = [];

	//put the name in to the tags
	var splitName = card.lcaseName.split(' ')
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

var getKeywordsFromDescription = function(description) {
	var abilities = Keywords.getAbilities();
}