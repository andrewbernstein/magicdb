angular.module('project', [ 'ngRoute' ])
	//.value('fbURL', 'https://angularjs-projects.firebaseio.com/')
	//.factory('Projects', function($firebase, fbURL) {
	//	return $firebase(new Firebase(fbURL));
	//})

	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				controller: 'MainController',
				templateUrl :'/static/templates/main.html'
			})
			.when('/search/:searchTerms', {
				controller: 'SearchController',
				templateUrl: '/static/templates/cards.html'
			})
			.when('/card/:cardName', {
				controller: 'CardController',
				templateUrl: '/static/templates/cards.html'
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
	.controller('SearchController', function($scope) {

	})
	.controller('CardController', function($scope) {

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