var SearchController = require('./../controllers/CardSearchController');
var CardController = require('./../controllers/CardController');
var KeywordsController = require('./../controllers/KeywordsController');
var SetController = require('./../controllers/SetController');
var config = require('config');

var indexGet = function(req, res) {
	var pageData = {};
	res.render('index', pageData);
};
exports.indexGet = indexGet;

var searchGet = function(req, res) {
	var pageData = {};
	pageData.imageBaseUrl = config.images.baseUrl;

	res.render('search', pageData);
};
exports.searchGet = searchGet;

var searchPost = function(req, res) {
	var pageData = {};
	pageData.imageBaseUrl = config.images.baseUrl;

	var searchQuery = req.body.query;
	SearchController.cardSearch(searchQuery, function(err, results) {
		if(err) {
			console.error(err);
			return res.json({ error: true });
		}

		pageData.results = results;
		res.render('search', pageData);
	});
};
exports.searchPost = searchPost;

var cardGet = function(req, res) {
	var pageData = {};
	pageData.imageBaseUrl = config.images.baseUrl;

	var cardName = decodeURIComponent(req.params.cardName);
	CardController.getCard(cardName, function(err, results) {
		if(err) {
			console.error(err);
			return res.json({ error: true });
		}

		pageData.results = results;
		res.render('singleCard', pageData);
	});
};
exports.cardGet = cardGet;

var setGet = function(req, res) {
	var pageData = {};
	pageData.imageBaseUrl = config.images.baseUrl;

	var setName = decodeURIComponent(req.params.setName);
	CardController.getSet(setName, function(err, results) {
		if(err) {
			console.error(err);
			return res.json({ error: true });
		}

		pageData.results = results;
		res.render('search', pageData);
	});
};
exports.setGet = setGet;

var cardJson = function(req, res) {
	var cardName = req.params.cardName;
	CardController.getCard(cardName, function(err, results) {
		if(err) {
			console.error(err);
			return res.json({ error: true });
		}
		if(results && results.length == 1) {
			res.json(results[0]);
		}
		else {
			res.json({});
		}
	});
};
exports.cardJson = cardJson;

var setJson = function(req, res) {
	var setName = req.body.site;
	CardController.getSet(setName, function(err, results) {
		if(err) {
			console.error(err);
			return res.json({ error: true });
		}

		res.json(results);
	})
};
exports.setJson = setJson;

var searchJson = function(req, res) {
	var searchQuery = req.params.search;
	SearchController.cardSearch(searchQuery, function(err, results) {
		if(err) {
			console.error(err);
			return res.json({ error: true });
		}

		res.json(results);
	});
};
exports.searchJson = searchJson;

var randomCardJson = function(req, res) {
	CardController.getRandomCard(function(err, card) {
		if(err) {
			console.error(err);
			return res.json({ error: true });
		}

		res.json(card);
	});
};
exports.randomCardJson = randomCardJson;

var getAllSetsByReleaseDateJson = function(req, res) {
	SetController.getAllSetsByReleaseDate(function(err, sets) {
		if(err) {
			console.error(err);
			return res.json({ error: true });
		}

		res.json(sets);
	});
};
exports.getAllSetsByReleaseDateJson = getAllSetsByReleaseDateJson;