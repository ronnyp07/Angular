'use strict';

//Locations service used to communicate Locations REST endpoints
angular.module('locations')
.factory('Locations', ['$resource', function($resource) {
		return $resource('locations/:locationId', { locationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
	
]).factory('Notify', ['$rootScope', function($rootScope) {
	var notify = {};
	notify.msg = '';

	notify.sendbroadCast = function(mgs){
	  this.msg = mgs;
	  this.broadCast(mgs);
	  console.log(this.mgs);
	};

	notify.broadCast = function(msg){
		$rootScope.$broadcast('noError', msg);
	};

    notify.sendMsg = function(msg, data){
       data = data || {};
       $rootScope.$emit(msg, data);
    };

    notify.getMsg = function(msg, func, scope){
     var unbind = $rootScope.$on(msg, func);

      if(scope){
          scope.$on('destroy', unbind);
      }
    };

    return notify;
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
 
}]).factory('LocationAction', ['$http', '$q', function($http, $q){
    var resultActions = {};

    resultActions.getlocationList = function(){
        var defer = $q.defer();
        $http.post('locations/getList').
            success(function(data){
              defer.resolve(data);
             }).
             error(function(err){
              defer.reject(err);
          });        
        return defer.promise;
     };
     return{
        resultActions
     };
}

]);
