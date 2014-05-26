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
		'$scope', '$location', '$routeParams', '$timeout', '$http', 'Search',
		function($scope, $location, $routeParams, $timeout, $http, Search) {
			$scope.performSearch = Search;
			$scope.searchparam = $routeParams.search;
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
		'$scope', '$location', '$routeParams', '$timeout', '$http', 'Search',
		function($scope, $location, $routeParams, $timeout, $http, Search) {
			$scope.performSearch = Search;
			$http.get('/json/set/' + $routeParams.setName).success(function(results) {
				$scope.cards = results;
				$timeout(function() {
					$location.path('/set/' + $routeParams.setName);
				});
			});
		}
	]);