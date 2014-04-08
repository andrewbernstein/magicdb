var SearchController = require('./../controllers/CardSearchController');
var CardController = require('./../controllers/CardController');
var KeywordsController = require('./../controllers/KeywordsController');
var config = require('config');

var indexGet = function(req, res) {
	var pageData = {};
	pageData.imageBaseUrl = config.images.baseUrl;

	pageData.sets = KeywordsController.getPrintingSets();
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
	SearchController.cardSearch(searchQuery, function(results) {
		pageData.results = results;
		res.render('search', pageData);
	});
};
exports.searchPost = searchPost;

var cardGet = function(req, res) {
	var pageData = {};
	pageData.imageBaseUrl = config.images.baseUrl;

	var cardName = decodeURIComponent(req.params.cardName);
	CardController.getCard(cardName, function(results) {
		pageData.results = results;
		res.render('singleCard', pageData);
	});
};
exports.cardGet = cardGet;

var setGet = function(req, res) {
	var pageData = {};
	pageData.imageBaseUrl = config.images.baseUrl;
	
	var setName = decodeURIComponent(req.params.setName);
	CardController.getSet(setName, function(results) {
		pageData.results = results;
		res.render('search', pageData);
	});
}
exports.setGet = setGet;