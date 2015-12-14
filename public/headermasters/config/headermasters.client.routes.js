'use strict';

//Setting up route
angular.module('headermasters').config(['$stateProvider',
	function($stateProvider) {
		// Headermasters state routing
		$stateProvider.
		state('listHeadermasters', {
			url: '/headermasters',
			templateUrl: 'headermasters/views/list-headermasters.client.view.html'
		}).
		state('createHeadermaster', {
			url: '/headermasters/create',
			templateUrl: 'headermasters/views/create-headermaster.client.view.html'
		}).
		state('viewHeadermaster', {
			url: '/headermasters/:headermasterId',
			templateUrl: 'headermasters/views/view-headermaster.client.view.html'
		}).
		state('editHeadermaster', {
			url: '/headermasters/:headermasterId/edit',
			templateUrl: 'headermasters/views/edit-headermaster.client.view.html'
		});
	}
]);