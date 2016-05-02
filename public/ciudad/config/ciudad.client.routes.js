'Use strict';

angular.module('ciudad').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('ciudad', {
			url: '/ciudad',
			templateUrl: 'ciudad/views/list-ciudad.client.view.html'
		});
	}
]); 