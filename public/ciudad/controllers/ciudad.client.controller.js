
var ciudadModule = angular.module('ciudad');

// ciudad controller
ciudadModule.controller('ciudadController', [
	'$scope', 
	'$http', 
	'$routeParams',  
	'$location', 
	'Authentication', 
	'Ciudad', 
	'Pais',
	'Notify',
	'$modal', 
	'$log',
	function($scope, $http, $routeParams, $location, Authentication, Ciudad, Pais, Notify, $modal, $log) {
	'use strict';
	this.authentication = Authentication;

	    // Find a list of ciudad
	   this.ciudad = Ciudad.query();

    //Open the middleware to open a single ciudad modal.
	 this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'ciudad/views/create-ciudad.client.view.html',
		      controller: 'modalResutl',
		      size: size
		 });

	 modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };


     //Open the middleware to open a single ciudad modal.
	 this.modelUpdate = function (size, selectedciudad) {
		    var modalInstance = $modal.open({
		      templateUrl: 'ciudad/views/edit-ciudad.client.view.html',
		      controller:  ['$scope', '$modalInstance', 'ciudad', function ($scope, $modalInstance, ciudad) {
                 $scope.ciudad = ciudad;
                 $scope.ciudad.rpais = selectedciudad.pais._id;
                 Notify.sendbroadCast('noError', 'this is a message');
                 $scope.ok = function () { 	
                  $modalInstance.close($scope.ciudad);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      }],
		      size: size,
		      resolve: {
		        ciudad: function () {
		          return selectedciudad;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedciudad) {
      $scope.selected = selectedciudad;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	  // Remove existing Pai
	this.remove = function(ciudad) {
			if( ciudad ) { 
				ciudad.$remove();

				for (var i in this.ciudad) {
					if (this.ciudad [i] === ciudad) {
						this.ciudad.splice(i, 1);
					}
				}
			} else {
				this.ciudad.$remove(function() {
				});
			}
		};

		
	
	 }
]);

ciudadModule.controller('modalResutl',  function ($scope, $modalInstance) {
  'use strict';

  $scope.ok = function () {	
    $modalInstance.close();
   };


  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


ciudadModule.controller('CiudadCreateController', ['$scope',  'Ciudad', 'Notify', 'Pais',
	function($scope, Ciudad, Notify, Pais) {
	'use strict';
  
	  this.pais = Pais.query();
	  	// // Create new Pai
	  this.create = function() {
			// Create new Pai object
	   var ciudads = new Ciudad ({
				name: this.name,
				pais: this.Selectedpais
	   });
			

			// Redirect after save
			ciudads.$save(function(response) {
             Notify.sendMsg('newPis', {'id': response._id});
				// Clear form fields
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

ciudadModule.controller('ciudadUpdateController', ['$scope', 'Authentication', 'Ciudad', 'Pais', 'Notify',
	function($scope, Authentication, Ciudad, Pais, Notify) {
        'use strict';
  
          this.pais = Pais.query();
	      this.update = function(updateciudad) {
          
	      var ciudad = new Ciudad ({
	      		_id: updateciudad._id,
				name: updateciudad.name,
				pais: $scope.ciudad.rpais
	       });

		  ciudad.$update(function() {
		  	 Notify.sendMsg('newPis', {'id': 'update'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
	   };
     	
	}
]);


ciudadModule.directive('ciudadList', ['Ciudad', 'Notify', function(Ciudad, Notify){
    'use strict';
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'ciudad/views/ciudad-list.template.html',
    link: function(scope, element, attr){
           Notify.getMsg('newPis', function(event, data){
            scope.ciudadCtrl.ciudad = Ciudad.query();
         });
    }
  };
}]);


