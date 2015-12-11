'use strict';

//Setting up route
angular.module('result').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('result', {
			url: '/result',
			templateUrl: 'result/views/result-clientes.client.view.html'
		}).
		state('resultId', {
			url: '/result/:resultId',
			templateUrl: 'results/views/edit-result.client.view.html'
		});
	}
]); 