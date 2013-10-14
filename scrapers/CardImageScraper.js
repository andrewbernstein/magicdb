/*
	Scrape card images off of mtgdb.info (same source as cards.json) because mooching off other sites is bad
 */
var config = require('config');
var http = require('http');
var request = require('request');
var fs = require('fs');
var async = require('async');

var scrapers = [];

var scrapeCards = function() {
	var cards = require('../' + config.functions.cardFile);

	for(var cKey in cards) {
		var card = cards[cKey];
		(function(card) {
			scrapers.push(function(callback) {
				console.log('attempting to scrape ' + card.Id);
				var r = request(card.card_image).pipe(fs.createWriteStream(__dirname + '/../cardimages/' + card.Id + '.jpg'));
				r.on('close', function() {
					callback();
				})
			});
		})(card);
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