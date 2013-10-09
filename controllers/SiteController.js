var SearchController = require('./../controllers/CardSearchController');

var indexGet = function(req, res) {
	res.render('index');
}
exports.indexGet = indexGet;

var searchGet = function(req, res) {
	res.render('search');
}
exports.searchGet = searchGet;

var searchPost = function(req, res) {
	console.log(req.body);
	var searchQuery = req.body.query;
	SearchController.cardSearch(searchQuery, function(results) {
		console.log(results);
		res.render('search', { results: results });
	});
}
exports.searchPost = searchPost;