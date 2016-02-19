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
  'resultServices',
	function($scope, $http, $stateParams, $location, Authentication, Result, Orders, Notify, ngTableParams, $modal, $log, ConvertArray, GetResults, resultServices) {
 	this.authentication = Authentication;
  
   
   var param1= $stateParams.resultId;
    $scope.resultId = $stateParams.resultId.replace(':', '');
    $scope.resultServices = resultServices;
    $scope.resultServices.getResults().then(function(){
    $scope.resultServices.selectedResult = $scope.resultServices.getResultById($scope.resultId);
    if($scope.resultServices.selectedResult.tipomuestra === 'C'){
      $scope.resultServices.reportName = 'Reporte Citológico';
    }else{
      $scope.resultServices.reportName = 'Reporte Histopatológico';
    };
    $scope.resultServices.resultado = $scope.resultServices.selectedResult.resultado;
    

   });
  

	$scope.update = function(){
          $scope.resultServices.update($scope.resultServices.muestra);

          //$scope.resultServices.create($scope.muestra, $scope.resultDetails);
          //console.log($scope.resultServices.selectedResult);
      
          // $scope.resultData.resultado = $scope.muestra;
          // $scope.resultData.diagnostico = $scope.resultDetails.diagnostico
        
        // var resultSaveAccion = {
        //       clinica : $scope.resultData.clinica_id,
        //       costo: $scope.resultData.costo,
        //       debe: $scope.resultData.debe,
        //       pago: $scope.resultData.pago,
        //       doctor: $scope.resultData.doctor_id,
        //       orders: $scope.resultData.orders._id ,
        //       patientReport: $scope.resultData.patientReport._id,
        //       procs: $scope.resultData.procs,
        //       rSereal: $scope.resultData.rSereal,
        //       reportStatus: 'Listo',
        //       resultado : $scope.resultDetails.tipomuestra === 'P' ? $scope.muestra : resultado,
        //       seguroDesc : $scope.resultData.seguroDesc,
        //       seguroId : $scope.resultData.seguroId_id,
        //       tipomuestra: $scope.resultData.tipomuestra,
        //       tipomuestraDesc: $scope.resultData.tipomuestraDesc,
        //       diagnostico : $scope.resultDetails.diagnostico,          
        //       nota:$scope.resultDetails.nota,
        //       created: $scope.resultData.created,
        //       pdateDate : Date.now,
        //       noAutho : $scope.resultDetails.noAutho,
        //       updatedUser: this.authentication.user
        // };

         //console.log($scope.resultData);
        // console.log($scope.muestra);
         // var resultupdate = new Result({
         //     	 _id: resultId,
         //       resultado: resultado,
         //       diagnostico:  $scope.resultDetails.diagnostico,
         //       noAutho: $scope.resultDetails.noAutho,
         //       total: $scope.resultDetails.total,
         //       reportStatus: 'Listo',
         //       nota: $scope.resultDetails.nota,
         //       tecnica: $scope.resultDetails.tecnica
         //     });

         //  if($scope.resultDetails.tipomuestra === 'P'){

         //    var muestra = $scope.muestra;
         //    console.log(muestra); 
         //    var resultPap = new Result({
         //       _id: resultId,
         //       resultado: muestra,
         //       diagnostico:  $scope.resultDetails.diagnostico,
         //       noAutho: $scope.resultDetails.noAutho,
         //       total: $scope.resultDetails.total,
         //       reportStatus: 'Listo'
         //     });

         //    resultPap.$update(function(){ 
         //     }, function(errorResponse) {
         //      console.log(errorResponse);
         //    });
          
         //  }else {
         //  resultupdate.$update(function(){ 
	        //  }, function(errorResponse) {
	        // $scope.error = errorResponse.data.message
	        // });
         //  }
         //  $location.path('/ordenesList');
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
  'lodash',
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
 	 $location,
   lodash
 		) {

   $scope.date = {
        //startDate: moment().subtract("months", 1),
        startDate: moment().subtract("days", 1),
        endDate: moment()
    };
  
   $scope.getDatecurrentPage = 1;
   $scope.pageSize = 25;
   
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
        count: 25,
        filter: filterLetter,
        startDate: startDate,
        endDate: dateFilter.endDate
      }
    })
    .then(function(result) {
      //console.log(result);
       $scope.users = result.data.results;
       $scope.totalUsers = result.data.total;

      $http.get('/api/result',  {
        params: {
        page: 1,
        count: $scope.totalUsers,
        filter: filterLetter,
        startDate: startDate,
        endDate: dateFilter.endDate
      }
    })
    .then(function(totalResult) {
      $scope.printReport = totalResult.data.results;
      $scope.total = {
          costo: 0,
          pago : 0,
          debe: 0,
          seguro: 0
      };  

      for(var i = 0; i < totalResult.data.results.length; i++){
        //console.log(totalResult.data.results[i].costo);
            $scope.total.costo = parseInt($scope.total.costo) + parseInt(totalResult.data.results[i].costo ? totalResult.data.results[i].costo: 0);
            $scope.total.pago = parseInt($scope.total.pago) + parseInt(totalResult.data.results[i].pago ? totalResult.data.results[i].pago: 0);
            $scope.total.debe = parseInt($scope.total.debe) + parseInt(totalResult.data.results[i].debe ? totalResult.data.results[i].debe: 0);
            $scope.total.seguro = parseInt($scope.total.seguro) + parseInt(totalResult.data.results[i].seguroId ? 1: 0);
      }
     });

       // $scope.dataTotal = lodash.chain($scope.users)
       //                  .map(function(item){
       //                 var totalCosto = getTotalCosto(item.costo);
       //                return {
       //                  totalCosto: totalCosto
                       
       //                };
       //              })
       //              .value();

       // function getTotalCosto(item){
       //  //console.log(item);
       //    var costo = 0;
       //    if(item){
       //    costo = costo  + parseInt(item);
       //    }
       //    return costo;
       // }

       //console.log($scope.dataTotal.totalCosto);

    });
    }
    
     $scope.setResult = function(result){
      $location.path('/result/:' + result._id);
     };

     $scope.setUpdate = function(proc){
       Notify.sendMsg('orderUpdate', {resultInfo: proc});
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
        }else{
           printSection.innerHTML = '';
        }

        function link(scope, element, attrs) {
            element.on('click', function () {
                var elemToPrint = document.getElementById(attrs.printElementId);
                //elemToPrint.innerHTML = document.getElementById('resultValue').value;
                 var formToHide = document.getElementById('createtemplateForm');
                 formToHide.classList.add('hide');
                if (elemToPrint) {
                    printElement(elemToPrint);
                    formToHide.classList.remove('hide');
                }
            });
        }
        function printElement(elem) {
            printSection.innerHTML = '';
            //document.getElementById(attrs.printElementId);
            printSection.appendChild(elem);
            window.print();
            //location.reload(true);
        }
        return {
            link: link,
            restrict: 'A',
            controller: function($scope){
              
            }
        };

});

resultModule.service('resultServices', ['$q','$timeout', '$http', 'Result', 'Authentication', function($q, $timeout, $http, Result, Authentication){

   var self = {
   'resultList' : [],
   'selectedResult': null,
   'isPrinting': false,
   'resultado': {},
   'reportName': null,
   'papObservation': null,
   'getResults' : function(){
    var defer = $q.defer();
     $http.post('result/getList').
          success(function(data){
            if(data){
              self.resultList = [];
                angular.forEach(data, function(dataresult){
                 // console.log(dataresult);
                  self.resultList.push(dataresult);
                  defer.resolve();
                });
              }

             }).
             error(function(err){
           });
       return defer.promise;

     },
     'getResultById': function(resultId){
          for (var i = 0; i < self.resultList.length; i++) {
              var obj = self.resultList[i];
              if (obj._id === resultId) {
                 console.log("completed");
                return obj;
            }
          }
        },
      'update': function(muestra){
         var updateResult = new Result({
            _id: self.selectedResult._id,
            resultado: self.resultado,
            noAutho : self.selectedResult.noAutho,
            updatedUser: Authentication.user._id,
            reportStatus: 'Listo'
         });

          updateResult.$update(function(){ 
             }, function(errorResponse) {
              console.log(errorResponse);
          });
          
      },
   };

   self.getResults();

   return self;
}
]);

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

resultModule.directive('topHeader', function(){
    return {
          restrict: 'E',
          templateUrl: 'results/partials/report-topHeader.html'
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

resultModule.directive('resultDetailreport', function(){
    return {
          restrict: 'E',
          templateUrl: 'results/partials/result.body.pap.print.report.html'
     };
});













