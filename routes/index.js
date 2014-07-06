var SiteController = require('./../controllers/SiteController.js');
var ejs = require('ejs');

var addRoutes = function(app) {
	app.get('/', SiteController.indexGet);
	app.get('/search', SiteController.searchGet);
	app.post('/search', SiteController.searchPost);

	app.get('/card/:cardName', SiteController.cardGet);
	app.get('/set/:setName', SiteController.setGet);

	app.get('/json/search/:search', SiteController.searchJson);
	app.get('/json/card/:cardName', SiteController.cardJson);
	app.get('/json/set/:setName', SiteController.setJson);
	app.get('/json/randomCard', SiteController.randomCardJson);
	//I don't like this route name, need to think of something cleaner
	app.get('/json/getAllSetsByReleaseDate', SiteController.getAllSetsByReleaseDateJson);
}
exports.addRoutes = addRoutes;