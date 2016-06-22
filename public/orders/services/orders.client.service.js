/*jshint strict:false */
'Use strict';

// Crear el service 'patients'
angular.module('orders')
.factory('Orders', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('api/orders/:ordersId', {
        ordersId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}])

.factory('Notify', ['$rootScope', function($rootScope, $q, $scope) {
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
 
}])
.factory('CierreControl', ['$q', '$http', function($q, $http){
   var getCierre = this;

   getCierre.getActiveCurrentMonth = function(type){
      var q = $q.defer();

       $http.post('/api/getMaxB', {type: type}).
        success(function(result){
          console.log(result);
          q.resolve(result);
        }).error(function(err){
          q.reject(err);
        });

      return q.promise;
   };

   return getCierre;

}]).factory('socketio',['$rootScope', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}]);

