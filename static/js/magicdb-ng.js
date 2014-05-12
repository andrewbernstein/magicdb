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

	.controller('MainController', function($scope, $location, $timeout) {
		//TODO: should really async.parallel these two ajax calls
		$.get('/json/randomCard', function(card) {
			$scope.card = card;
			$.get('/json/getAllSetsByReleaseDate', function(sets) {
				$scope.sets = sets;
				$timeout(function() { $location.path('/')});
			});
		});
	})
	.controller('SearchController', function($scope, $location, $routeParams, $timeout) {
		if($routeParams.search) {
			$.get('/json/search/' + $routeParams.searchTerms, function(results) {
				$scope.results = results;
				$timeout(function() { $location.path('/search/' + $routeParams.searchTerms )});
			});
		}
	})
	.controller('CardController', function($scope, $location, $routeParams, $timeout) {
		$.get('/json/card/' + $routeParams.card, function(card) {
			$scope.card = card;
			$timeout(function() {
				$scope.cardSet = {};
				$scope.cardSet.cardSetName = card.printings[0].cardSetName;
				$location.path('/card/' + $routeParams.card);
			});
		})
	})
	.controller('SetController', function($scope) {

	});
/*
	.controller('CreateCtrl', function($scope, $location, $timeout) {
		$scope.save = function() {
			Projects.$add($scope.project, function() {
				$timeout(function() { $location.path('/'); });
			});
		};
	})

	.controller('EditCtrl',
	function($scope, $location, $routeParams, $firebase, fbURL) {
		var projectUrl = fbURL + $routeParams.projectId;
		$scope.project = $firebase(new Firebase(projectUrl));

		$scope.destroy = function() {
			$scope.project.$remove();
			$location.path('/');
		};

		$scope.save = function() {
			$scope.project.$save();
			$location.path('/');
		};
	});
	*/