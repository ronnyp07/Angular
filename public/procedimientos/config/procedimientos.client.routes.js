'use strict';

//Setting up route
angular.module('procs').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('procs', {
			url: '/procs',
			templateUrl: 'procedimientos/views/list-procedimientos.client.view.html'
		});
	}
]); 