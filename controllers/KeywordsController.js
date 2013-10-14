var cardTypes = require('./../keywords/cardTypes.json');
var sets = require('./../keywords/sets.json');
var abilities = require('./../keywords/abilities.json');
var setAbbreviations = require('./../keywords/setAbbreviations.json');

var getCardTypes = function() {
	return cardTypes;
}
exports.getCardTypes = getCardTypes;

var getSets = function() {
	return sets;
}
exports.getSets = getSets;

var getAbilities = function() {
	return abilities;
}
exports.getAbilities = getAbilities;

var getSetAbbreviations = function() {
	return setAbbreviations;
}
exports.getSetAbrreviations = getSetAbbreviations;