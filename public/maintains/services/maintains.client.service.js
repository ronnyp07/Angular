'use strict';

//Maintains service used to communicate Maintains REST endpoints
angular.module('maintains')
.factory('Maintains', ['$resource',
	function($resource) {
		return $resource('maintains/:maintainId', 
			  {maintainId: '@_id'}, {
			   update: {
				method: 'PUT'
			},
			 'save': {
            method: 'POST',
            isArray: true
		    }
		});
	}
]).factory('MaintainsR', ['$resource',
    function($resource) {
        return $resource('api/getList/:maintainId', 
              {maintainId: '@_id'}, {
               update: {
                method: 'PUT'
            },
             'save': {
            method: 'POST',
            isArray: true
            }
        });
    }
]).factory('MaintainsAction', ['$http', '$q', function($http, $q){
         var resultActions = {};
         resultActions.getMbyCode = function(param){
               var defer = $q.defer();
                $http.post('/api/maintains/getBycode', {mCode: param})
                 .success(function(data){
                 	 resultActions.codeFilter = data;
                     defer.resolve(data);
                     
                }).error(function(error){
					 defer.reject(error);
                });
                return defer.promise;
         };

         return {
              resultActions
         };

}]).service('MaintainsService', ['$http', '$q', function($http, $q){
        var self = {
         'results': [],
         'load' : function(){
               var defer = $q.defer();
                $http.get('/maintains')
                 .success(function(data){
                 console.log(data);
                if(data.length !== 0){
 					angular.forEach(data, function(daraResult){
 					  self.results.push(daraResult);
 					});
                }
                     defer.resolve(data);

                }).error(function(error){
					 defer.reject(error);
                });

                return defer.promise;
           }
         };
         self.load();
         return self;

}])
.factory('MaintainList',  function(){
         var code = {
           
             Gender: 104,
             Estatus_Civil: 105,
             Tipo_Sangre: 106,
             Religion: 108,
             Idioma: 109,
             Nacionalidad: 110,        
             Relacion_Paciente: 111,
             Tipo_Consulta: 112,
             Estado_Consulta : 113,

         };
        return code;

}).factory('MaintainsHeaderAction', ['$http', '$q', function($http, $q){
         var resultActions = {};
         resultActions.getMbyCode = function(param){
               var defer = $q.defer();
                $http.post('/api/maintains/getHeaderByCode', {maintainsId: param})
                 .success(function(data){
                     resultActions.codeFilter = data;
                     defer.resolve(data);
                     
                }).error(function(error){
                     defer.reject(error);
                });
                return defer.promise;
         };

         return {
              resultActions
         };
}]);

