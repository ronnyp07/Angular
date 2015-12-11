'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('orders', {
			url: '/orders',
			templateUrl: 'orders/views/orders-clientes.client.view.html'
		}).
		state('ordenesList', {
			url: '/ordenesList',
			templateUrl: 'orders/views/list-order.client.view.html'
		});
	}
]); 