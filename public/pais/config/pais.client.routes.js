/*jshint strict:false */
'Use strict';


//Setting up route
angular.module('pais').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('pais', {
			url: '/pais',
			templateUrl: 'pais/views/list-pais.client.view.html'
		});
	}
]); 