/*
	Scrape card images off of mtgdb.info (same source as cards.json) because mooching off other sites is bad
 */
var config = require('config');
var http = require('http');
var request = require('request');
var fs = require('fs');
var async = require('async');
var knox = require('knox');

var s3config = require('./../config/s3config.json');

var s3 = knox.createClient({
	key: s3config.accessKeyId,
	secret: s3config.secretAccessKey,
	bucket: 'magicdb-cards'
});

var scrapers = [];
var cardHost = 'http://api.mtgdb.info/content/card_images/';

var scrapeCards = function() {
	var cards = require('../' + config.functions.cardFile);

	for(var cKey in cards) {
		var card = cards[cKey];
		(function(card) {
			scrapers.push(function(callback) {
				var url = cardHost + card.id + '.jpeg';
				console.log('getting url', url);
				http.get(url, function (res) {
					//console.log('request', res.statusCode, card.id);
					s3.putStream(res, '/' + card.id + '.jpg', {
						'Content-Length': res.headers['content-length'],
						'Content-Type': 'image/jpeg',
						'x-amz-acl': 'public-read'
					}, function(error, res) {
						if(error) {
							console.error(card.id, error);
							res.resume();
							callback();
						}
						//console.log('knox', res.statusCode, card.id);
						res.resume();
						callback();
					});
				});
			});
		})(card);
	}
	console.log('attempting to start scrapers');
	console.log('total scrapers: ' + scrapers.length);
	async.parallelLimit(scrapers, 50, function(err, results) {
		if(err) {
			console.error(err);
		}
		console.log('done!');
		process.exit();
	});
}
exports.scrapeCards = scrapeCards;