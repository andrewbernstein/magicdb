/*
	Scrape card images off of mtgdb.info (same source as cards.json) because mooching off other sites is bad
 */
var config = require('config');
var http = require('http');
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
var hiResCardHost = 'http://api.mtgdb.info/content/hi_res_card_images/';
var startId = -1;
//las successful import: 391941

var scrapeCards = function() {
	var cards = require('../' + config.functions.cardFile);

	for(var cKey in cards) {
		var card = cards[cKey];
		if(startId && card.id < startId) {
			continue;
		}
		(function(card) {
			scrapers.push(function(callback) {
				var url = cardHost + card.id + '.jpeg';
				console.log('getting url', url);
				http.get(url, function (res) {
					//console.log('request', res.statusCode, card.id);
					if(res.statusCode != 200) {
						console.error('non-200 status code for card id', card.id, res.statusCode);
						return callback();
					}
					s3.putStream(res, '/' + card.id + '.jpg', {
						'Content-Length': res.headers['content-length'],
						'Content-Type': 'image/jpeg',
						'x-amz-acl': 'public-read'
					}, function(error, resp) {
						if(error) {
							console.error(card.id, error);
							callback(error);
						}
						resp.resume();
						console.log('finished scraper ', card.id);
						callback(null, card.id);
					});
				});
			});
			scrapers.push(function(callback) {
				//for some reason, the high res cards end with .jpg while the regular res ones end with .jpeg
				var url = hiResCardHost + card.id + '.jpg';
				console.log('getting url', url);
				http.get(url, function (res) {
					//console.log('request', res.statusCode, card.id);
					if(res.statusCode != 200) {
						console.error('non-200 status code for hires card id', card.id, res.statusCode);
						return callback();
					}
					s3.putStream(res, '/' + card.id + '.hires.jpg', {
						'Content-Length': res.headers['content-length'],
						'Content-Type': 'image/jpeg',
						'x-amz-acl': 'public-read'
					}, function(error, resp) {
						if(error) {
							console.error(card.id, error);
							callback(error);
						}
						resp.resume();
						console.log('finished scraper hires', card.id);
						callback(null, card.id);
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