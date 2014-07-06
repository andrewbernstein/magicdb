angular.module('project', [ 'ngRoute' ])

	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				controller: 'MainController',
				templateUrl :'/static/templates/main.html'
			})
			.when('/search', {
				controller: 'SearchController',
				templateUrl: '/static/templates/cards.html'
			})
			.when('/search/:search', {
				controller: 'SearchController',
				templateUrl: '/static/templates/cards.html'
			})
			.when('/card/:card', {
				controller: 'CardController',
				templateUrl: '/static/templates/card.html'
			})
			.when('/set/:setName', {
				controller: 'SetController',
				templateUrl: '/static/templates/cards.html'
			})
			.otherwise({
				redirectTo:'/'
			});
	})
	.filter('colorFilter', function() {
		return function(cards, color) {
			return cards.filter(function(card) {
				if(color == '' || card.colors.indexOf(color) !== -1) {
					return true;
				}
				return false;
			});
		}
	})
	.factory('Search', [
		'$location',
		function($location) {
			return function() {
				var searchTerm = $('#searchquery').val();
				if (searchTerm) {
					$location.path('/search/' + searchTerm);
				}
			}
		}]
	)
	.factory('RarityComparator', function() {
		return function(actual, expected) {
			//we have to check inside the printings of the card to see if
			if(!expected) {
				return true;
			}
			var res = false;
			actual.forEach(function(a) {
				/*
				 Here's what I don't get: expected is an object {rarity: "Rare"}
				 For the color comparator above, it isn't.  If anyone can explain this, let me know.
				 */
				if(a.rarity == expected.rarity) {
					res = true;
				}
			});
			return res;
		};
	})
	.factory('ColorComparator', function() {
		return function(actual, expected) {
			//colors is an array of the card's colors, so we can't use angular's default filter :/
			//therefore, we use check to see if the card has the expected color inside the array
			if(!expected) {
				return true;
			}
			return actual.indexOf(expected) != -1;
		};
	})
	.controller('MainController', [
		'$scope', '$location', '$timeout', '$http', 'Search',
		function($scope, $location, $timeout, $http, Search) {
			$scope.card = null;
			$scope.performSearch = Search;
			$http.get('/json/randomCard').success(function(card) {
				$http.get('/json/getAllSetsByReleaseDate').success(function(sets) {
					$scope.card = card;
					$scope.sets = sets;
				});
			});
		}
	])
	.controller('SearchController', [
		'$scope', '$location', '$routeParams', '$timeout', '$http', 'Search', 'RarityComparator', 'ColorComparator',
		function($scope, $location, $routeParams, $timeout, $http, Search, RarityComparator, ColorComparator) {
			$scope.performSearch = Search;
			$scope.searchparam = $routeParams.search;
			$scope.colorComparator = ColorComparator;
			$scope.rarityComparator = RarityComparator;
			if($routeParams.search) {
				$http.get('/json/search/' + $routeParams.search).success(function(results) {
					$scope.cards = results;
				});
			}
		}
	])
	.controller('CardController', [
		'$scope', '$location', '$routeParams', '$timeout', '$http', 'Search',
		function($scope, $location, $routeParams, $timeout, $http, Search) {
			$scope.performSearch = Search;
			$http.get('/json/card/' + $routeParams.card).success(function(card) {
				$scope.card = card;
				$scope.cardSet = {};
				$scope.cardSet.cardSetName = card.printings[0].cardSetName;
			});
		}
	])
	.controller('SetController', [
		'$scope', '$location', '$routeParams', '$timeout', '$http', 'Search', 'RarityComparator', 'ColorComparator',
		function($scope, $location, $routeParams, $timeout, $http, Search, RarityComparator, ColorComparator) {
			$scope.performSearch = Search;
			$scope.colorComparator = ColorComparator;
			$scope.rarityComparator = RarityComparator;
			$scope.colorText = '';
			$http.get('/json/set/' + $routeParams.setName).success(function(results) {
				$scope.cards = results;
				$timeout(function() {
					$location.path('/set/' + $routeParams.setName);
				});
			});
		}
	]);