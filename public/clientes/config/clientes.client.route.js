'Use strict';

//Setting up route
angular.module('clientes').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$stateProvider.
		state('listClientes', {
			url: '/clientes',
			templateUrl: 'clientes/views/list-clientes.client.view.html'
		});
	}
]);


