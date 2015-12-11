'use strict';

//Setting up route
angular.module('maintains').config(['$stateProvider',
	function($stateProvider) {
		// Maintains state routing
		$stateProvider.
		state('listMaintains', {
			url: '/maintains',
			templateUrl: 'modules/maintains/views/list-maintains.client.view.html'
		}).
		state('createMaintain', {
			url: '/maintains/create',
			templateUrl: 'modules/maintains/views/create-maintain.client.view.html'
		}).
		state('viewMaintain', {
			url: '/maintains/:maintainId',
			templateUrl: 'modules/maintains/views/view-maintain.client.view.html'
		}).
		state('editMaintain', {
			url: '/maintains/:maintainId/edit',
			templateUrl: 'modules/maintains/views/edit-maintain.client.view.html'
		});
	}
]);