'use strict';

var clienteModule = angular.module('clientes');

// cliente controller
clienteModule.controller('clienteController', [
	'$scope', 
	'$http',  
	'$location', 
	'Authentication',
	'Pais',
	'Ciudad',
	'Sector', 
	'Cliente', 
	'Notify',
	'ngTableParams',
	'$modal', 
	'$log',
	function($scope, $http,  $location, Authentication, Pais, Ciudad, Sector, Cliente, Notify, ngTableParams, $modal, $log) {
		this.authentication = Authentication;

		 // alertify.dialog("Message", function factory(){
			// return {
   //                   build: function(){
   //                   	var html = '<i class="fa fa-building-o"></i>';
   //                   	html += 'wao';
   //                   	this.setHeader(html);
   //                   }
			// };
			// }, false, 'alert');
	

	    // Find a list of cliente
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
	        Cliente.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
	        });
	      
	        }
       };

	  $scope.tableParams = new ngTableParams( params, settings);
      //Open the middleware to open a single cliente modal.
	  this.modelCreate = function (size) {
		    var modalInstance = $modal.open({
		      templateUrl: 'clientes/views/create-clientes.client.view.html',
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
          templateUrl: 'clientes/views/edit-clientes.client.view.html',
          controller: function ($scope, $modalInstance, cliente) {

          	 console.log(selectedClient);
               $scope.cliente = cliente;
               $scope.cliente.rpais = selectedClient.pais;
               $scope.cliente.rciudad = selectedClient.ciudad;
               $scope.cliente.rsector = selectedClient.sector;
               console.log($scope.cliente.rciudad);
          $scope.ok = function () {  
            $modalInstance.close($scope.cliente);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            cliente: function () {
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

     Notify.getMsg('seguroLoad', function(event, data ){
     	 $scope.doSearch();
     	 alertify.success('Acción realizada exitosamente!! !!');
     });


	 this.modelRemove = function (size, selectedcliente) {
	   	    $scope.cliente = selectedcliente;
		    var modalInstance = $modal.open({
		      templateUrl: 'clientes/views/clientes-delete.template.html',
		      controller: 
		      //'modalDelete',
		      function ($scope, $modalInstance, cliente) {
                 $scope.cliente = cliente;

                  $scope.ok = function () {
                   //console.log($scope.cliente);
                  // $scope.doSearch();
                  $modalInstance.close($scope.cliente);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size,
		      resolve: {
		        cliente: function () {
		          return selectedcliente;
		        }
		      }
		 });

	 modalInstance.result.then(function (selectedcliente) {
      $scope.selected = selectedcliente;
      //console.log($scope.selected);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  // Remove existing Pai
	$scope.remove = function(cliente) {
			if( cliente ) { 
				cliente.$remove();

				for (var i in this.cliente) {
					if (this.cliente [i] === cliente) {
						this.cliente.splice(i, 1);
					}
				}
			} else {
				this.cliente.$remove(function() {
				});
			}
		};
	 }
]);


clienteModule.controller('clienteDeleteController', ['$scope', 'Authentication', 'Cliente', 'Notify',
	function($scope, Authentication, Cliente, Notify) {
		//$scope.authentication = Authentication;
        
	      this.delete = function(cliente) {
	       var cliente = new Cliente({
                _id: $scope.cliente._id
	       });

	       cliente.$remove(function(){
	        Notify.sendMsg('seguroLoad', {'id': 'nada'});
	       }, function(errorResponse) {
		  	$scope.error = errorResponse.data.message;
		   });
	   };	
	}
]);

clienteModule.controller('clienteUpdateController', ['$scope', 'Authentication', 'Cliente', 'Notify', 'Pais', 'Ciudad', 'Sector', '$mdToast', '$animate',
	function($scope, Authentication, Cliente, Notify, Pais, Ciudad, Sector, $mdToast, $animate) {

		 this.pais = Pais.query();
		 this.ciudad = Ciudad.query();
		 this.sector = Sector.query();
		 
		 this.filterByPais = function(){
            this.sector = {};
           
		 };

		 this.filterByCiudad = function(){
		 	this.sector = Sector.query();
		 };
	 
	    this.update = function(updateCliente) {
	   	     console.log("patientUpdate");

	      	var cliente  = new Cliente ({
	      		_id: updateCliente._id,
				name: updateCliente.name,
				tipo: updateCliente.tipo,
                clienteRNC: updateCliente.clienteRNC,
                clienteTelefono: updateCliente.clienteTelefono,
                pais: $scope.cliente.rpais,
	            ciudad: $scope.cliente.rciudad,
	            sector: $scope.cliente.rsector,
	            clienteDireccion: updateCliente.clienteDireccion
	       });

	     this.showSimpleUdpdate = function() {
			    $mdToast.show(
			      $mdToast.simple()
			        .content('Paso!!')
			        .position('bottom right')
			        .hideDelay(3000)
			    );
		};
	
	   cliente.$update(function() {
		  	 Notify.sendMsg('seguroLoad', {'id': 'nada'});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
	   };
     	
	}
]);

 clienteModule.controller('modalResutl',  function ($scope, $modalInstance) {

   $scope.ok = function () {
     $modalInstance.close();
    };


   $scope.cancel = function () {
     $modalInstance.dismiss('cancel');
   };
 });


 clienteModule.controller('clienteCreateController', 
 	['$scope', 
 	'Cliente', 
 	'Notify', 
 	'Pais',
 	'Ciudad',
 	'Sector',
 	function($scope, Cliente, Notify, Pais, Ciudad, Sector) {

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
 	   var clientes = new Cliente ({
 				name: this.name,
 				tipo: 'A',
                clienteRNC: this.clienteRNC,
                clienteTelefono: this.clienteTelefono,
                pais: this.clientePais,
	            ciudad: this.clienteCiudad,
	            sector: this.clienteSector,
	            clienteDireccion: this.clienteDireccion
 	      });
 			
			clientes.$save(function(response) {
             Notify.sendMsg('seguroLoad', {'id': 'nada'});
 			}, function(errorResponse) {
 				$scope.error = errorResponse.data.message;
 			});
 	  };

 	}
 ]);



clienteModule.directive('clienteList', ['Cliente', 'Notify', function(Cliente, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'clientes/views/clientes-list.template.html',
     link: function(scope, element, attr){          
          // when a new cliente is added update the cliente List..
          // Notify.getMsg('newcliente', function(event, data){
         // 	scope.rpais = data;
            
         // });

            Notify.getMsg('newPis', function(event, data){            	console.log('got the message');
            scope.clienteCtrl.doSearch(); 
         });
    }
   };
 }]);


