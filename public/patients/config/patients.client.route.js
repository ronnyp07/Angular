// Invocar modo JavaScript 'strict'


// Configurar el módulo routes de 'patients'
angular.module('patients').config(['$stateProvider',
	function($stateProvider) {
		'use strict';
		$stateProvider.
		state('patients', {
			url: '/patients',
			templateUrl: 'patients/views/list-patients.client.view.html'
		});
	}
]);