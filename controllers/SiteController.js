var SearchController = require('./../controllers/CardSearchController');
var CardController = require('./../controllers/CardController');
var KeywordsController = require('./../controllers/KeywordsController');

var indexGet = function(req, res) {
	//TODO: Not all of these work!
	var setAbbreviations = KeywordsController.getSetAbrreviations();
	res.render('index', {sets: setAbbreviations});
};
exports.indexGet = indexGet;

var searchGet = function(req, res) {
	res.render('search');
};
exports.searchGet = searchGet;

var searchPost = function(req, res) {
	console.log(req.body);
	var searchQuery = req.body.query;
	SearchController.cardSearch(searchQuery, function(results) {
		res.render('search', { results: results });
	});
};
exports.searchPost = searchPost;

var cardGet = function(req, res) {
	var cardName = decodeURIComponent(req.params.cardName);
	console.log(cardName);
	CardController.getCard(cardName, function(results) {
		res.render('singleCard', { results: results });
	});
};
exports.cardGet = cardGet;

var setGet = function(req, res) {
	var setName = decodeURIComponent(req.params.setName);
	CardController.getSet(setName, function(results) {
		res.render('search', { results: results });
	});
}
exports.setGet = setGet;