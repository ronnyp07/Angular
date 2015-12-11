// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'tempresult'
angular.module('tempresult').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('tempresult', {
			url: '/tempresult',
			templateUrl: 'tempresult/views/list-tempresult.client.view.html'
		});
	}
]); 