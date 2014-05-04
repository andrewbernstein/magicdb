var express = require('express');
var config = require('config');
var routes = require('./routes');
var ejs = require('ejs');

require('console-ten').init(console);

if(config.functions.scrapeSetImages) {
	console.log('scraping set images!');
	var SetIconScraper = require('./scrapers/SetIconScraper');
	SetIconScraper.scrapeCards();
}

var app = express();
app.engine('.ejs', ejs.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use("/static", express.static(__dirname + '/static'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

routes.addRoutes(app);

app.listen(config.server.port);
console.log('listening on port ' + config.server.port);