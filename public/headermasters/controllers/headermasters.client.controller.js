'use strict';

// Headermasters controller
angular.module('headermasters').controller('HeadermastersController', 
	['$scope', 
	 '$stateParams', 
	 '$location', 
	 'Authentication', 
	 'Headermasters',
	function(
	 $scope, 
	 $stateParams, 
	 $location, 
	 Authentication, 
	 Headermasters) {
     $scope.authentication = Authentication;
     console.log($scope.authentication);
     var vm = this;

    vm.sendMaintainDetails = function(){
     	var header = new Headermasters({
     		code : vm.code,
     		value : vm.name,
     		description: vm.description,
     		maintainParent : $scope.matainArray._id,
     		createDate: Date.now(),
     		createUser: $scope.authentication.user._id
     	});

     	header.$save(function(data){
     		alertify.success('Acción realizada exitósamente!!'); 
     	}, function(error){
     	});
     };
	}
]).controller('HeadermastersUpdateController', [
     '$scope', 
	 '$stateParams', 
	 '$location', 
	 'Authentication', 
	 'Headermasters',
	 'MaintainDetailsService',
	 '$timeout',
	function(
	 $scope, 
	 $stateParams, 
	 $location, 
	 Authentication, 
	 Headermasters,
	 MaintainDetailsService,
	 $timeout) {

	 $scope.authentication = Authentication;
     var vm = this;
     vm.code = $scope.detailsInfo.code;
     vm.name = $scope.detailsInfo.value;
     vm.description  = $scope.detailsInfo.description;

     vm.UpdateCtrlDetails = function(){
     	vm.isSaving = true;
       var param = {
       	    id: $scope.detailsInfo._id,
       		code: vm.code,
       		value: vm.name,
       		description: vm.description,
       		createUser: $scope.authentication.user._id
       };

       MaintainDetailsService.update(param)
       .then(function(){
       	$timeout(function() {
        	vm.isSaving = false;
            alertify.success('Acción realizada exitósamente!!'); 
        }, 1000);
         
       });
     };


}
]);