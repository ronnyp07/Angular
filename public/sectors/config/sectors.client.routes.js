'use strict';

angular.module('sector').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('sector', {
			url: '/sector',
			templateUrl: 'sectors/views/list-sectors.client.view.html'
		});
	}
]); 