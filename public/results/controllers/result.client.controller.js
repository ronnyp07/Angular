'use strict';

var resultModule = angular.module('result');

resultModule.controller('resultController', [
	'$scope', 
	'$http', 
	'$stateParams',  
	'$location', 
	'Authentication',
	'Result',
	'Orders',
	'Notify',
	'ngTableParams',
	'$modal', 
	'$log',
	'ConvertArray',
	'GetResults',
	function($scope, $http, $stateParams, $location, Authentication, Result, Orders, Notify, ngTableParams, $modal, $log, ConvertArray, GetResults) {
	this.authentication = Authentication;

		var param1= $stateParams.resultId;
		var resultId = param1.replace(':', '');
        var resultado = [];
        var reportStatus = '';
        $scope.resultDetails = {};
        $scope.muestra = {};
        $http.post('api/resultfilter', {resultId: resultId}).
		      success(function(data){
            console.log(data);
		     	$scope.resultData = data;
		     	      $scope.resultDetails.diagnostico = $scope.resultData[0].diagnostico;
                $scope.resultDetails.resultado = $scope.resultData[0].resultado.toString();
                $scope.resultDetails.resultadoArray = $scope.resultData[0].resultado;
                $scope.resultDetails.rSereal = $scope.resultData[0].rSereal;
                $scope.resultDetails.nombre = $scope.resultData[0].patientReport.patientFirstName + ' ' + $scope.resultData[0].patientReport.patientLastName;
                $scope.resultDetails.doctorName = $scope.resultData[0].doctor.firstName + ' ' + $scope.resultData[0].doctor.lastName;
                $scope.resultDetails.clienteName = $scope.resultData[0].clinica.name; 
                $scope.resultDetails.created = $scope.resultData[0].orders.created;
                $scope.resultDetails.patiendEdad = $scope.resultData[0].orders.patientEdad;
                $scope.resultDetails.tipomuestraDesc = $scope.resultData[0].tipomuestraDesc;
                $scope.resultDetails.tipomuestra = $scope.resultData[0].tipomuestra;
                $scope.resultDetails.total = $scope.resultData[0].total;
                $scope.resultDetails.noAutho = $scope.resultData[0].noAutho;
                $scope.resultDetails.reportStatus = $scope.resultData[0].reportStatus;
                $scope.resultDetails.nota = $scope.resultData[0].nota;
                $scope.resultDetails.tecnica  = $scope.resultData[0].tecnica;

                if($scope.resultData[0].tipomuestra == 'C'){
                	$scope.resultDetails.reportName = 'Reporte Citológico';
                }else if ($scope.resultData[0].tipomuestra == 'B'){
                	$scope.resultDetails.reportName = 'Reporte Histopatológico';
                }else if ($scope.resultData[0].tipomuestra == 'P'){
                  if($scope.resultData[0].resultado[0]){
                     $scope.muestra = $scope.resultData[0].resultado[0];
                    }
                  console.log($scope.resultData[0].resultado[0]);
                }
		 }).
		 error(function(err){
		  console.log(err);
		});

	$scope.update = function(){
      
        if($scope.resultDetails.resultado){
            resultado = ConvertArray.arrayConvert($scope.resultDetails.resultado);
          }
        
         var resultupdate = new Result({
             	 _id: resultId,
               resultado: resultado,
               diagnostico:  $scope.resultDetails.diagnostico,
               noAutho: $scope.resultDetails.noAutho,
               total: $scope.resultDetails.total,
               reportStatus: 'Listo',
               nota: $scope.resultDetails.nota,
               tecnica: $scope.resultDetails.tecnica
             });

          if($scope.resultDetails.tipomuestra === 'P'){

            var muestra = $scope.muestra;
            console.log(muestra); 
            var resultPap = new Result({
               _id: resultId,
               resultado: muestra,
               diagnostico:  $scope.resultDetails.diagnostico,
               noAutho: $scope.resultDetails.noAutho,
               total: $scope.resultDetails.total,
               reportStatus: 'Listo'
             });

            resultPap.$update(function(){ 
             }, function(errorResponse) {
              console.log(errorResponse);
            });
          
          }else {
          console.log('asdfasdfasdfasfd');
          resultupdate.$update(function(){ 
	         }, function(errorResponse) {
	        $scope.error = errorResponse.data.message
	        });
          }
          $location.path('/ordenesList');
		};

	 }
]);

 resultModule.controller('resultUpdateController', 
 	['$scope', 
 	 '$http',
 	'$stateParams', 
	'Orders',
	'ngTableParams',
 	'Notify',
 	'$mdToast', 
 	'$animate',
 	'$modal', 
	'$log',
 	function(
 	 $scope, 
 	 $http,
 	 $stateParams, 
 	 Orders, 
 	 ngTableParams,
 	 Notify, 
 	 $mdToast, 
 	 $animate,
 	 $modal,
 	 $log
 		//, $stateParams
 		) {
    
   //Auto Cierre


     } 
 ]);

  resultModule.controller('resultListController', 
 	['$scope', 
 	 '$http',
 	'$stateParams', 
	'Orders',
	'ngTableParams',
 	'Notify',
 	'$mdToast', 
 	'$animate',
 	'$modal', 
	'$log',
	'$location',
 	function(
 	 $scope, 
 	 $http,
 	 $stateParams, 
 	 Orders, 
 	 ngTableParams,
 	 Notify, 
 	 $mdToast, 
 	 $animate,
 	 $modal,
 	 $log,
 	 $location
 		) {

   $scope.date = {
        //startDate: moment().subtract("months", 1),
        startDate: moment().subtract("days", 1),
        endDate: moment()
    };
  
   $scope.getDatecurrentPage = 1;
   $scope.pageSize = 10;
   
    $scope.q = "";

    $scope.users = [];
    $scope.totalUsers = 0;
    $scope.usersPerPage = 25; // this should match however many results your API puts on one page
    getResultsPage(1, $scope.q, setDateVariables());


    function loadGrid(){
    getResultsPage(1, $scope.q, setDateVariables());
    }
    loadGrid();

     Notify.getMsg('newOrderPost', function(event, data ){
     loadGrid();
     });

    $scope.dateChange = function(pagination, filter){
    	 getResultsPage($scope.cPage, filter, setDateVariables());
    };

    $scope.pageChanged = function(newPage, filter, pgCurrent) {
    	 var startDate = new Date($scope.date.startDate);
    	 var endDate = new Date($scope.date.endDate);
    
        var dateFilter = {
        	startDate: startDate,
        	endDate: endDate      	
        };
        getResultsPage(newPage, filter, setDateVariables());
    };

    function setDateVariables(){
      var startDate = new Date($scope.date.startDate);
    	 var endDate = new Date($scope.date.endDate);
        var dateFilter = {
        	startDate: startDate,
        	endDate: endDate
        	
        };
    	return dateFilter;
    }

 	function getResultsPage(pageNumber, filterLetter, dateFilter) {
     var startDate = dateFilter.startDate;
      $http.get('/api/result',  {
        params: {
        page: pageNumber,
        count: 10,
        filter: filterLetter,
        startDate: startDate,
        endDate: dateFilter.endDate
      }
    })
      .then(function(result) {
                $scope.users = result.data.results;
                $scope.totalUsers = result.data.total
    });
    }
    
     $scope.setResult = function(result){
             $location.path('/result/:' + result._id);
     };
     } 
 ]);


resultModule.directive('ngPrint', function(){
 var printSection = document.getElementById('printSection');
        // if there is no printing section, create one
        if (!printSection) {
            printSection = document.createElement('div');
            printSection.id = 'printSection';
            document.body.appendChild(printSection);
        }
        function link(scope, element, attrs) {
            element.on('click', function () {
                var elemToPrint = document.getElementById(attrs.printElementId);
                //elemToPrint.innerHTML = document.getElementById('resultValue').value;
                if (elemToPrint) {
                    printElement(elemToPrint);
                }
            });
            window.onafterprint = function () {
                // clean the print section before adding new content
                printSection.innerHTML = '';
            };
        }
        function printElement(elem) {
            // clones the element you want to print
            var domClone = elem.cloneNode(true);
            printSection.appendChild(domClone);
            window.print();
            location.reload(true);
        }
        return {
            link: link,
            restrict: 'A',
            controller: function($scope){
              
            }
        };

});

resultModule.directive('printCitologia', function(){
    return {
          restrict: 'E',
          templateUrl: 'results/partials/print-citology.report.html'
     };
});

resultModule.directive('printBiopsia', function(){
    return {
          restrict: 'E',
          templateUrl: 'results/partials/print-biop.report.html'
     };
});

resultModule.directive('resultBody', function(){
    return {
          restrict: 'E',
          templateUrl: 'results/partials/result.body.report.html'
     };
});

resultModule.directive('resultBodypop', function(){
    return {
          restrict: 'E',
          templateUrl: 'results/partials/result.body.pap.report.html'
     };
});

resultModule.directive('resultPrintpop', function(){
    return {
          restrict: 'E',
          templateUrl: 'results/partials/result.body.pap.print.report.html'
     };
});











