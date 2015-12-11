'use strict';

angular.module('index').config(['$stateProvider', 
    function($stateProvider){
    	$stateProvider
    	  .state('home', {
    	  	 url: '/',
             templateUrl: 'index/views/index.client.html'
    	  });
}]);


// angular.module('doctor').config(['$stateProvider',
// 	function($stateProvider) {
// 		$stateProvider.
// 		state('listDoctors', {
// 			url: '/doctors',
// 			templateUrl: 'doctors/views/list-doctor.client.view.html'
// 		});
// 	}
// ]); 
