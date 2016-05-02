/*jshint strict:false */
'Use strict';

// Configurar el módulo routes de 'patients'
angular.module('doctor').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listDoctors', {
			url: '/doctors',
			templateUrl: 'doctors/views/list-doctor.client.view.html'
		});
	}
]); 