'use strict';

//Setting up route
angular.module('cierre').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('cierre', {
			url: '/cierre',
			templateUrl: 'cierretrack/views/create-cierretrack.client.view.html'
		});
	}
]); 