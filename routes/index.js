var SiteController = require('./../controllers/SiteController.js');
var ejs = require('ejs');

var addRoutes = function(app) {
	app.get('/', SiteController.indexGet);
	app.get('/search', SiteController.searchGet);
	app.post('/search', SiteController.searchPost);
}
exports.addRoutes = addRoutes;