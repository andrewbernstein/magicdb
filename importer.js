var express = require('express');
var config = require('config');
var routes = require('./routes');
var ejs = require('ejs');

require('console-ten').init(console);

console.log('importing cards!');
var CardImportController = require('./controllers/CardImportController');
CardImportController.importCards();