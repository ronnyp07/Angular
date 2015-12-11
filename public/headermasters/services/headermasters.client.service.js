'use strict';

//Headermasters service used to communicate Headermasters REST endpoints
angular.module('headermasters').factory('Headermasters', ['$resource',
	function($resource) {
		return $resource('headermasters/:headermasterId', { headermasterId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).service('MaintainDetailsService', 
   ['$http', 
    '$q', 
    'Headermasters',
    'lodash', 
    function($http, $q, Headermasters, lodash){

var self = {
		'results': [],
		'refresh': function () {
			self.page = 1;
			self.isLoading = false;
			self.hasMore = true;
			self.results = [];
			return self.load();
		},
		'next': function () {
			self.page += 1;
			return self.load();
		},
		'load': function (param) {
			self.isLoading = true;
			var deferred = $q.defer();
			$http.post('api/headermasters/listByHeader', {params: param})
				.success(function (data) {
					if (data.length === 0) {
						  console.log('Not Data');
					} else {
						angular.forEach(data, function (business) {
							self.results.push(business);
						});
					}

					deferred.resolve(data);
				})
				.error(function (data, status, headers, config) {
					self.isLoading = false;
					deferred.reject(data);
				});
			 
			return deferred.promise;
		},
		'update': function(param){
			var deferred = $q.defer();

		    var headerDetails	= new Headermasters({
		    	_id: param.id,
		    	code: param.code,
		    	value: param.value,
		    	description: param.description,
				updateUser: param.createUser,
				updateDate: Date.now()
			});
			console.log(headerDetails);

			headerDetails.$update(function(data){
				deferred.resolve(data);
			}, function(error){
                 deferred.reject(error);
			});

			return deferred.promise;

		},
	    'getHeaderMaster': function(param){
	      var defer = $q.defer();
         var maintains = Headermasters.query(); 
         $http.get('/headermasters').success(function(data){
         var result = lodash.chain(data)
                      .filter(function(maintan){
              if(maintan.maintainParent){
             	if(maintan.maintainParent.maintainId === param){
             		return  true;
             	}else{
             		console.log(maintan.maintainParent.maintainId, param);
             	}
             }else{
             	return false;
             }                                   
             })
             .value();
              console.log(result);
              defer.resolve(result);
         }).error(function(err){
         	  defer.reject(err);
         });
         return defer.promise;
      
       }
	};

	return self;
}
]).factory('HeaderDetailsList',  function(){
         var code = {        
             Por_Venir: 150,
             En_Espera: 151,
             Completado: 152,
             Cancelado: 153,
             Pospuesto: 154,
             
             Por_Venir_id: '565e0e236227ea89d8709a0f',
             En_Espera_id: '565e0e3f6227ea89d8709a10',
             Completado_id:'565e0e4f6227ea89d8709a11',
             Cancelado_id: '565e0e606227ea89d8709a12',
             Pospuesto_id: '565e0e7c6227ea89d8709a13'
         };
        return code;

});