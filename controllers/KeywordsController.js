var cardTypes = require('./../keywords/cardTypes.json');
var sets = require('./../keywords/sets.json');
var abilities = require('./../keywords/abilities.json');
var setAbbreviations = require('./../keywords/setAbbreviations.json');
var setReplacements = require('./../keywords/setReplacements.json');
var printingSets = require('./../keywords/printingSets.json');
var setNames = require('./../keywords/setNames.json')

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

var getSetReplacements = function() {
	return setReplacements;
}
exports.getSetReplacements = getSetReplacements;

var getPrintingSets = function() {
	return printingSets;
}
exports.getPrintingSets = getPrintingSets;

var getSetNames = function() {
	return setNames;
}
exports.getSetNames = getSetNames;