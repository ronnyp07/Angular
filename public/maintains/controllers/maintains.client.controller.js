/*jshint strict:false */
'Use strict';
// Maintains controller
var maintainModule = angular.module('maintains');

maintainModule.controller('MaintainsController', 
['$scope', 
 '$stateParams', 
 '$location', 
 'Authentication',
 'ngTableParams',
 '$modal', 
  '$log', 
 'Maintains',
 '$mdSidenav',
 'MaintainsR',
 'Headermasters',
 '$mdToast',
 'MaintainDetailsService',
  function(
  $scope, 
  $stateParams, 
  $location, 
  Authentication, 
  ngTableParams,
  $modal, 
  $log,
  Maintains,
  $mdSidenav,
  MaintainsR,
  Headermasters,
  $mdToast,
  MaintainDetailsService){

   /*
        ==================================
			Create By: Ronny Morel
			Creating Date: 10/26/2015
			Description: Inicialate the maintaining page, upload the list table and fill the control.
        ==================================
   */
	   var vm = this;
	   vm.authentication = Authentication;
	   vm.currentPage = 1; 
     vm.pageSize = 5;
	   vm.maintainList = Maintains.get();
	   vm.maintainList2 = MaintainsR.query();
     
	   vm.clearValue = function() {
	    vm.maintain = '';
	    vm.maintainList2 = MaintainsR.query();
	    vm.codigo = '';
	    vm.name = '';
	    vm.desc = '';
	   };

     vm.maintainsDetailUpdate = function(index, maintain){
     };

     vm.stateForm = function(param){
      $scope.enableInsertForm = param;
     };

     vm.stateUpdateForm = function(param){
       $scope.enableUpdateForm = param;
     };

     vm.setDetailsUpdate = function(matain){
          $scope.maintainDetailUpdate = matain;
     };

	   var params = {
          page: 1,            
          count: 15,
          filter: {             
              name: name
          }
        };

       var settings = {
         total: 0,  
         counts: [15,20,25],        
         getData: function($defer, params) {
         Maintains.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
          });
          }
       };
    
    /* jshint ignore:start */
       vm.tableParams = new ngTableParams( params, settings);
    /* jshint ignore:end */

          function buildToggler(navID) {
		      return function() {
		        $mdSidenav(navID)
		          .toggle()
		          .then(function () {
		            $log.debug('toggle ' + navID + ' is done');
		          });
		      };
		    }

		    $scope.close = function () {
		      $mdSidenav('right').close()
		        .then(function () {
		          $log.debug("close RIGHT is done");
		        });
		    };
     
     	  $scope.toggleRight = buildToggler('right');
		     $scope.isOpenRight = function(){
		      return $mdSidenav('right').isOpen();
		   };

       vm.loadDetails = function(param){
          MaintainDetailsService.load(param._id)
             .then(function(data){
            $scope.maintaindetails = data;
          });
       };

      //PopUp list of the details mantains
      //Ronny Morel - 10-26-2015 
      this.modelUpdate = function (size, selecteditem) {     
          var modalInstance = $modal.open({
          templateUrl: 'maintains/views/maintain-details.template.html',
          controller: ['$scope', '$modalInstance', 'maintain', function ($scope, $modalInstance, maintain) {
          vm.loadDetails = function(){
            MaintainDetailsService.load(maintain._id)
             .then(function(data){
            $scope.maintaindetails = data;
          });
          };
          vm.loadDetails();
          $scope.selecteditem = maintain;
          $scope.ok = function () {
             $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          }],
          size: size,
          resolve: {
            maintain: function () {
              return selecteditem;
            }
          }
        });
          modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      //Popup Update for header mantains
      //Ronny Morel - 11-26-2015 
      this.modelUpdateHeader = function (size, selectedHeader) {     
          var modalInstance = $modal.open({
          templateUrl: 'maintains/template/maintains-header.update.html',
          controller: ['$scope', '$modalInstance', 'maintainHeader', function ($scope, $modalInstance, maintainHeader) {
          $scope.maintainHeader = maintainHeader;
          $scope.ok = function () {
             $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          }],
          size: size,
          resolve: {
            maintainHeader: function () {
              return selectedHeader;
            }
          }
        });
          modalInstance.result.then(function (selectedHeader) {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

       vm.doSearch = function () {
	        vm.tableParams.reload();
	     }; 

	     $scope.showPatientSave = function() {
	      $mdToast.show(
	        $mdToast.simple()
	          .content('Completado con exito!!')
	          .position('top right')
	          .hideDelay(3000)
	      );
	     };


		// Create new Maintain
		vm.create = function() {
			// Create new Maintain object
			var maintain = new Maintains ({
				name: vm.name,
				code: vm.code,
				desc: vm.desc
			});

			// Redirect after save
			maintain.$save(function(response) {
				vm.doSearch();
				$scope.showPatientSave();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

maintainModule.controller('MaintainsControllerUpdate', 
 ['$scope', 'Maintains', '$location', '$mdToast', '$animate', '$timeout',
  function($scope, Maintains, $location, $mdToast, $animate, $timeout){
  
  var vm = this;
  vm.updateHeader = function(selectedHeader){
      vm.isSaving = true;
    var header = new Maintains({
        _id :  selectedHeader._id, 
        name: selectedHeader.name,
        code: selectedHeader.code,
        desc: selectedHeader.desc
    });
    header.$update(function(data){
      $timeout(function() {
          vm.isSaving = false;
            alertify.success('Acción realizada exitósamente!!'); 
        }, 1000);
    }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
     });
  };
  
}]);

maintainModule.controller('MaintainsControllerDetails', 
 ['$scope', 'Maintains', '$location', '$mdToast', '$animate',
  function($scope, Maintains, $location, $mdToast, $animate){
  this.sendMaintainDetails = function(){

    $scope.selecteditem.parameters.push({'value': this.name, 'description': this.description});

  	var details = new Maintains({
  		_id :  $scope.selecteditem._id, 
  		parameters : $scope.selecteditem.parameters
  	});

  	details.$update(function(data){
      alertify.success('Acción realizada exitósamente!!'); 
        // $scope.showSimpleUdpdate();
  	}, function(errorResponse) {
        $scope.error = errorResponse.data.message;
     });
  };
  
}]);

maintainModule.directive('mantainList', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'maintains/views/maintain-list.template.html'
    };
});

maintainModule.directive('mantaindetailsList', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'maintains/views/maintain-list.template.html'
    };
});

maintainModule.directive('mantainsTable', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'maintains/template/maintains.details.table.html'
    };
});

// maintainModule.directive('mantainsCreate', function(){
//     return {
//     restrict: 'E',
//     transclude: true,
//     templateUrl: 'modules/maintains/views/create-maintain.client.view.html'
//     };
// });

maintainModule.directive('mantainsCreate', function(){
    return {
    restrict: 'E',
    transclude: true,
    scope: {
      matainArray: '=data'
    },
    templateUrl: 'headermasters/views/create-headermaster.client.view.html'
    };
});


maintainModule.directive('mantainsUpdate', function(){
    return {
    restrict: 'E',
    transclude: true,
    scope: {
      detailsInfo: '=data'
    },
    templateUrl: 'headermasters/views/edit-headermaster.client.view.html'
    };
});