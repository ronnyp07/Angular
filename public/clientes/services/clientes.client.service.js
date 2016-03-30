'use strict';

// Crear el service 'patients'
angular.module('clientes')
.factory('Cliente', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('/api/clientes/:clienteId', {
        clienteId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}])

.factory('Notify', ['$rootScope', function($rootScope) {
	var notify = {};
	notify.msg = '';

	notify.sendbroadCast = function(mgs){
	  this.msg = mgs;
	  this.broadCast(mgs);
	  console.log(this.mgs);
	}

	notify.broadCast = function(msg){
		$rootScope.$broadcast('noError', msg);
	}

    notify.sendMsg = function(msg, data){
       data = data || {};
       $rootScope.$emit(msg, data);
    }

    notify.getMsg = function(msg, func, scope){
     var unbind = $rootScope.$on(msg, func);

      if(scope){
          scope.$on('destroy', unbind);
      }
    };

    return notify;
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
 
}]).factory('ClientAction', ['$http', '$q', function($http, $q){
    var resultActions = {};
    
    resultActions.getSegurosList = function(){
        var defer = $q.defer();
        $http.post('cliente/getList').
            success(function(data){
              defer.resolve(data);
             }).
             error(function(err){
              defer.reject(err);
          });        
        return defer.promise;
     };

     return resultActions;
}
]).service('ClienteService',['$http', '$q', function($http, $q){
    var self = {
      'result': [],
      'load' : function(){
         var defer = $q.defer();
         $http.post('cliente/getList').
          success(function(data){ 
            if(data.length !== 0){
              angular.forEach(data, function(daraResult){
                self.result.push(daraResult);
              });
            }
           defer.resolve(data);
           }).
           error(function(err){
            defer.reject(err);
          });
         return defer.promise;
      }
    };

    self.load();
    return self;
}]);




