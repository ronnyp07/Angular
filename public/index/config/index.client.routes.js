'use strict'

angular.module('index').config(['$routeProvider', 
    function($routeProvider){
    	$routeProvider
    	  .when('/', {
             templateUrl: 'index/views/index.client.html'
    	  });
}]);