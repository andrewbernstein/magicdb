var express = require('express');
var config = require('config');

require('console-ten').init(console);

if(config.functions.importCards) {
    console.log('importing cards!');
    var CardImportController = require('./controllers/CardImportController');
    CardImportController.importCards();
}

if(config.functions.runServer) {
    var app = express();
    //app.get('/search', )
}
