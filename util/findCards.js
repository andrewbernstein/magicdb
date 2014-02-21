var MongoService = require('./../services/MongoService');
var config = require('config');

var bustedSets = [ '', 'ALL', 'APC', 'ARN', 'ATQ', 'BRB', 'BTD', 'CHR', 'DRB', 'DRK', 'EXO', 'FEM', 'HML', 'ICE', 'INV',
					'LEG', 'LWR', 'MIR', 'MMQ', 'NEM', 'ODY', 'P02', 'PCY', 'PLS', 'POR', 'PTK', 'S00', 'S99', 'STH',
					'TMP', 'TSH', 'UDS', 'UGL', 'ULG', 'USG', 'V09', 'V10', 'V12', 'V13', 'WTH' ];

var foundSets = [ ];

MongoService.connect(function(db) {
	var cardsCollection = db.collection('cards');
	cardsCollection.find().toArray(function(err, results) {
		for(var cKey in results) {
			var card = results[cKey];
			for(var pKey in card.printings) {
				var printing = card.printings[pKey];
				//console.log(bustedSets.indexOf(printing.card_set_id), foundSets.indexOf(printing.card_set_id));
				if(bustedSets.indexOf(printing.card_set_id) != -1 && foundSets.indexOf(printing.card_set_id) == -1) {
					foundSets.push(printing.card_set_id);
					console.log('found set ' + printing.card_set_id + ' to have name ' + printing.card_set_name);
				}
			}
		}
	});
});