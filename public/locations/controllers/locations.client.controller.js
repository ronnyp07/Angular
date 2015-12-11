'use strict';

var locationModule = angular.module('locations');

// location controller
locationModule.controller('locationController', [
	'$scope', 
	'$http',  
	'$location', 
	'Authentication',
	'Pais',
	'Ciudad',
	'Sector', 
	'Locations', 
	'Notify',
	'ngTableParams',
	'$modal', 
	'$log',
	function($scope, $http,  $location, Authentication, Pais, Ciudad, Sector, Locations, Notify, ngTableParams, $modal, $log) {
		this.authentication = Authentication;

	    // Find a list of location
       var params = {
       	  page: 1,            
	      count: 15,
	      filter: {
            name: name
        }
       };

       var settings = {
      // 	groupBy: 'tipo',
       	total: 0,  
       	counts: [15,20,25],        
	    getData: function($defer, params) {
	        Locations.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
	        });
	      
	        }
       };

	  $scope.tableParams = new ngTableParams( params, settings);
      //Open the middleware to open a single location modal.
	  this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'locations/views/create-location.client.view.html',
		      controller: 'modalResutl',
		      size: size
		 });

	 modalInstance.result.then(function (selectedItem) {
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	    this.modelUpdate = function (size, selectedClient) {      
          var modalInstance = $modal.open({
          templateUrl: 'locations/views/edit-location.client.view.html',
          controller: function ($scope, $modalInstance, location) {

          	 console.log(selectedClient);
               $scope.location = location;
               $scope.location.rpais = selectedClient.pais;
               $scope.location.rciudad = selectedClient.ciudad;
               $scope.location.rsector = selectedClient.sector;
               console.log($scope.location.rciudad);
          $scope.ok = function () {  
            $modalInstance.close($scope.location);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            location: function () {
              return selectedClient;
            }
          }
     });

	   modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	      }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	      });
	  };

	  $scope.doSearch = function () {
		    $scope.tableParams.reload();
		};

     Notify.getMsg('updateLoc', function(event, data ){
     	 $scope.doSearch();
     	 alertify.success('Acción realizada exitosamente!! !!');
     });



	 this.modelRemove = function (size, selectedlocation) {
	   	    $scope.location = selectedlocation;
		    var modalInstance = $modal.open({
		      templateUrl: 'locations/views/delete-location.client.view.html',
		      controller: 
		      //'modalDelete',
		      function ($scope, $modalInstance, location) {
                 $scope.location = location;

                  $scope.ok = function () {
                   //console.log($scope.location);
                  // $scope.doSearch();
                  $modalInstance.close($scope.location);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        location: function () {
		          return selectedlocation;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedlocation) {
      $scope.selected = selectedlocation;
      //console.log($scope.selected);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  // Remove existing Pai
	$scope.remove = function(location) {
			if( location ) { 
				location.$remove();
				for (var i in this.location) {
					if (this.location [i] === location) {
						this.location.splice(i, 1);
					}
				}
			} else {
				this.location.$remove(function() {
				});
			}
		};
	 }
]);


locationModule.controller('locationDeleteController', ['$scope', 'Authentication', 'Locations', 'Notify',
	function($scope, Authentication, Locations, Notify) {
		//$scope.authentication = Authentication;
        
	      this.delete = function(location) {
	       var location = new Locations({
                _id: $scope.location._id
	       });

	       location.$remove(function(){
	        Notify.sendMsg('updateLoc', {'id': 'nada'});
	       }, function(errorResponse) {
		  	$scope.error = errorResponse.data.message;
		   });
	   };	
	}
]);

locationModule.controller('locationUpdateController', ['$scope', 'Authentication', 'Locations', 'Notify', 'Pais', 'Ciudad', 'Sector', '$mdToast', '$animate',
	function($scope, Authentication, Locations, Notify, Pais, Ciudad, Sector, $mdToast, $animate) {

		 this.pais = Pais.query();
		 this.ciudad = Ciudad.query();
		 this.sector = Sector.query();
		 
		 this.filterByPais = function(){
            this.sector = {};
           
		 };

		 this.filterByCiudad = function(){
		 	this.sector = Sector.query();
		 };
	 
	    this.update = function(updatelocation) {
	   	     console.log("patientUpdate");

	      	var location  = new Locations ({
	      		_id: updatelocation._id,
				name: updatelocation.name,
				tipo: updatelocation.tipo,
                locationRNC: updatelocation.locationRNC,
                locationTelefono: updatelocation.locationTelefono,
                pais: $scope.location.rpais,
	            ciudad: $scope.location.rciudad,
	            sector: $scope.location.rsector,
	            locationDireccion: updatelocation.locationDireccion
	       });

	 //     this.showSimpleUdpdate = function() {
		// 	    $mdToast.show(
		// 	      $mdToast.simple()
		// 	        .content('Paso!!')
		// 	        .position('bottom right')
		// 	        .hideDelay(3000)
		// 	    );
		// };
	
	   location.$update(function() {
		  	 Notify.sendMsg('updateLoc', {'id': 'update'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
	   };
     	
	}
]);

 locationModule.controller('modalResutl',  function ($scope, $modalInstance) {

   $scope.ok = function () {
     $modalInstance.close();
    };


   $scope.cancel = function () {
     $modalInstance.dismiss('cancel');
   };
 });


 locationModule.controller('locationCreateController', 
 	['$scope', 
 	'Locations', 
 	'Notify', 
 	'Pais',
 	'Ciudad',
 	'Sector',
 	function($scope, Locations, Notify, Pais, Ciudad, Sector) {

 	  this.pais = Pais.query();
 		
 	  this.filterByCity = function() {
        this.ciudad = Ciudad.query();
        this.sector = '';
        // this.sector = {};
 	  };

 	  this.filterSector = function(){
 	  	this.sector = Sector.query();
 	  };

 	  	// Create new Pai
 	  this.create = function() {
 			// Create new Pai object
 	   var locations = new Locations ({
 				name: this.name,
                locationRNC: this.locationRNC,
                locationTelefono: this.locationTelefono,
                pais: this.locationPais,
	            ciudad: this.locationCiudad,
	            sector: this.locationSector,
	            locationDireccion: this.locationDireccion
 	   });
			

 			//console.log(locations);
 			// Redirect after save
		locations.$save(function(response) {
              Notify.sendMsg('updateLoc', {'id': 'nada'});
             // Notify.sendbroadCast('noError');*/
             // this.location = location.query();
 				// Clear form fields
 			}, function(errorResponse) {
 				$scope.error = errorResponse.data.message;
 			});
 		 };

 	}
 ]);



locationModule.directive('locationList', ['Locations', 'Notify', function(location, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'locations/views/locations-list.template.html',
     link: function(scope, element, attr){          // when a new location is added update the location List..
          // Notify.getMsg('newlocation', function(event, data){
         // 	scope.rpais = data;
            
         // });

            Notify.getMsg('newPis', function(event, data){            	console.log('got the message');
            scope.locationCtrl.doSearch(); 
         });
    }
   };
 }]);


