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
	.controller('MainController', [
		'$scope', '$location', '$timeout', 'Search',
		function($scope, $location, $timeout, Search) {
			$scope.performSearch = Search;
			//TODO: should really async.parallel these two ajax calls
			$.get('/json/randomCard', function(card) {
				$scope.card = card;

				$.get('/json/getAllSetsByReleaseDate', function(sets) {
					$scope.sets = sets;
					$timeout(function() {
						$location.path('/');
					});
				});
			});
		}
	])
	.controller('SearchController', [
		'$scope', '$location', '$routeParams', '$timeout', 'Search',
		function($scope, $location, $routeParams, $timeout, Search) {
			$scope.performSearch = Search;
			$scope.searchparam = $routeParams.search;
			if($routeParams.search) {
				$.get('/json/search/' + $routeParams.search, function(results) {
					$scope.cards = results;
					$timeout(function() {
						$location.path('/search/' + $routeParams.search);
					});
				});
			}
		}
	])
	.controller('CardController', [
		'$scope', '$location', '$routeParams', '$timeout', 'Search',
		function($scope, $location, $routeParams, $timeout, Search) {
			$scope.performSearch = Search;
			$.get('/json/card/' + $routeParams.card, function(card) {
				$scope.card = card;
				$timeout(function() {
					$scope.cardSet = {};
					$scope.cardSet.cardSetName = card.printings[0].cardSetName;
					$location.path('/card/' + $routeParams.card);
				});
			});
		}
	])
	.controller('SetController', [
		'$scope', '$location', '$routeParams', '$timeout', 'Search',
		function($scope, $location, $routeParams, $timeout, Search) {
			$scope.performSearch = Search;
			$.get('/json/set/' + $routeParams.setName, function(results) {
				$scope.cards = results;
				$timeout(function() {
					$location.path('/set/' + $routeParams.setName);
				});
			});
		}
	]);