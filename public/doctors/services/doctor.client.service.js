/*jshint strict:false */
'Use strict';

// Crear el service 'patients'
angular.module('doctor').factory('Doctors', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
    return $resource('api/doctors/:doctorId', {
        doctorId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        'save': {
            method: 'POST',
            isArray: false
        }
    });
}])
    .factory('Notify', ['$rootScope', function($rootScope) {
    var notify = {};
    notify.msg = '';

    notify.sendbroadCast = function(mgs){
      this.msg = mgs;
      this.broadCast(mgs);
      //console.log(this.mgs);
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
 
}]).service('DoctorsService',['$http', '$q', 'Doctors', function($http, $q, Doctors){
    var self = {
      'result': [],
      'selectedDoctor': null,
      'refresh': function(){
        self.result = [];
        return self.load();
      },
      'checkDoctor': function(param){
          var defer = $q.defer();
          
          self.load().then(function(){
          var exists = false;

         for(var i = 0 ; i < self.result.length; i++){

          if(self.result[i].firstName && self.result[i].lastName){
               var name = self.result[i].firstName.trim() + ' ' + self.result[i].lastName.trim();
               var inputName = param.firstName.trim() + ' ' + param.lastName.trim();
               if(name.toLowerCase() === inputName.toLowerCase()){
                 exists = true;
                 defer.resolve(exists);
                 return;
               }
            }
         }

          defer.resolve(exists);

        });

        return defer.promise;
       
       },
      'load' : function(){
        self.result = [];
         var defer = $q.defer();
         $http.post('doctor/getList').
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
