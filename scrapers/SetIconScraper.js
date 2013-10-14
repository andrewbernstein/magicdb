/*
	Scrape set/rarity icons off of gatherer because mooching off other people is bad
 */
var config = require('config');
var http = require('http');
var request = require('request');
var fs = require('fs');
var async = require('async');
var KeywordsController = require('./../controllers/KeywordsController');

var scrapers = [];
var rarities = [ 'C', 'U', 'R', 'M' ];
var gathererUrl = 'http://gatherer.wizards.com/Handlers/Image.ashx?type=symbol&size=small';

var scrapeCards = function() {
	var abbreviations = KeywordsController.getSetAbrreviations();

	for(var aKey in abbreviations) {
		var setId = abbreviations[aKey];
		for(var rKey in rarities) {
			var rarity = rarities[rKey];
			(function(setId, rarity) {
				scrapers.push(function(callback) {
					console.log('attempting to scrape ' + setId + ' rarity ' + rarity);
					var url = gathererUrl + '&rarity=' + rarity + '&set=' + setId;
					var r = request(url).pipe(fs.createWriteStream(__dirname + '/../setImages/' + setId + '_' + rarity + '.jpg'));
					r.on('close', function() {
						callback();
					})
				});
			})(setId, rarity);
			}
		}

	console.log('attempting to start scrapers');
	console.log('total scrapers: ' + scrapers.length);
	async.parallelLimit(scrapers, 50, function(err, results) {
		if(err) {
			console.log('error', err);
		}
		console.log('done!');
	});
}
exports.scrapeCards = scrapeCards;