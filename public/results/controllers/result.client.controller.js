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
    }

    if($scope.resultServices.selectedResult.tipomuestra === 'B'){
      $scope.resultServices.tecnica = 'Hematoxilina, Eosina';
    }else if ($scope.resultServices.selectedResult.tipomuestra === 'BG'){
      $scope.resultServices.tecnica  = 'Hematoxilina, Eosina ' + '\n' +
                                       'Histoquímica de Waysson para HP';
      if(!$scope.resultServices.selectedResult.nota){
        $scope.resultServices.notaResult = 'La nota para las Biosia Gastrica siempre tendra nota: la técnica histoquímica de Waysson para helicobacter pylori resulto positivo (se identifican moderados microorganismos espiralados igual a 2 en una escala de 0 a 3) y Tecnica';
      }else{
        $scope.resultServices.notaResult = $scope.resultServices.selectedResult.nota;
      } 
    }
     $scope.resultServices.resultado = $scope.resultServices.selectedResult.resultado;
    });
  

	$scope.update = function(){
          $scope.resultServices.update($scope.resultServices.muestra).then(function(){
              $location.path('/orders');
          });   
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
  'resultServices',
  'OrderServices',
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
   resultServices,
   OrderServices,
   lodash
 		) {

   $scope.services = resultServices;
   $scope.orders = OrderServices;
   $scope.services.date.startDate = moment().subtract("days", 1);
   $scope.services.date.endDate = moment();

    $scope.loadMore = function(newPage, oldPage){
       $scope.services.page = newPage;
       $scope.services.loadResult(newPage);
    };

    $scope.resetSearchForm = function(){
      $scope.services.date.startDate = moment().subtract("days", 1);
      $scope.services.date.endDate = moment();
      $scope.services.resetForm();
    };

    $scope.filterResult = function(){
      $scope.services.filterResult();
    };

     Notify.getMsg('newOrderPost', function(event, data ){
       $scope.filterResult();
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

      $http.get('/api/result', {
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

resultModule.service('resultServices', ['$q','$timeout', '$http', 'Result', 'Authentication', '$rootScope', function($q, $timeout, $http, Result, Authentication, $rootScope){

   var self = {
   'resultList' : [],
   'Results': [],
   'search': {},
   'date': {},
   'params': {},
   'totales': {},
   'paramsPrint': {},
   'notaResult': null,
   'tecnica': null,
   'hasMore': true,
   'page': 1,
   'total': 0,
   'count': 25,
   'selectedResult': null,
   'isPrinting': false,
   'resultado': {},
    test: null,
   'reportName': null,
   'papObservation': null,
   'setResult': function(){
     self.resultado['tecnica'] = 'mierda';
   },
   'loadResult': function(){
    var defer = $q.defer();
      self.params = {
        'page': self.page,
        'search': self.search,
        'date': self.date,
        'ordering': self.ordering
      };
      Result.get(self.params, function(data){
        self.total = data.total;
        defer.resolve(data);
        self.Results = [];
       if(data.results){
           angular.forEach(data.results, function(item){
                self.Results.push(item);  
           });
           self.paramsPrint = {
              'page': 1,
              'search': self.search,
              'date': self.date,
              'count': self.total
           };
        Result.get(self.paramsPrint, function(totalResult){
           self.printReport = totalResult.results;
           self.totales = {
                costo: 0,
                pago : 0,
                debe: 0,
                seguro: 0
            };  

        for(var i = 0; i < totalResult.results.length; i++){
           self.totales.costo = parseInt(self.totales.costo) + parseInt(totalResult.results[i].costo ? totalResult.results[i].costo: 0);
           self.totales.pago = parseInt(self.totales.pago) + parseInt(totalResult.results[i].pago ? totalResult.results[i].pago: 0);
           self.totales.debe = parseInt(self.totales.debe) + parseInt(totalResult.results[i].debe ? totalResult.results[i].debe: 0);
           self.totales.seguro = parseInt(self.totales.seguro) + parseInt(totalResult.results[i].seguroId ? 1: 0);
      }
        });
        }
        if(self.count >= data.total){
            self.hasMore = false;
        }
      }, function(error){
          defer.reject();
      });
      return defer.promise;
   },
   'filterResult': function(){
        self.Results = [];
        self.count = 25;
        self.loadResult();
   },
   'resetForm': function(){
    self.search = {};
    self.filterResult();
   },
   'loadMore': function(page){
        if(self.hasMore){
            self.count += self.count;
            self.loadResult();
        }
     },
   'getResults' : function(){
    var defer = $q.defer();
     $http.post('result/getList').
          success(function(data){
            if(data){
              self.resultList = [];
                angular.forEach(data, function(dataresult){
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
                return obj;
            }
          }
        },
      'update': function(muestra){
        var defer = $q.defer();
         var updateResult = new Result({
            _id: self.selectedResult._id,
            resultado: self.resultado,
            nota: self.nota,
            tecnica: self.tecnica,
            noAutho : self.selectedResult.noAutho,
            updatedUser: Authentication.user._id,
            reportStatus: 'Listo'
         });

          updateResult.$update(function(){ 
            defer.resolve();
             }, function(errorResponse) {
              defer.reject();
              console.log(errorResponse);
          });

          return defer.promise;
          
      },
      'watchFilters': function () {
          $rootScope.$watch(function () {
            return self.search.paciente;
            }, function (newVal) {
              if(newVal){
              if (angular.isDefined(newVal)) {
                self.loadResult();
              }
          }
        });
         $rootScope.$watch(function () {
            return self.search.doctor;
            }, function (newVal) {
              if(newVal){
              if (angular.isDefined(newVal)) {
                self.loadResult();
              }
          }
        });

        $rootScope.$watch(function () {
            return self.search.seguro;
            }, function (newVal) {
              if (angular.isDefined(newVal)) {
                self.loadResult();
          }
        });

        $rootScope.$watch(function () {
            return self.search.sereal;
            }, function (newVal) {
              if (angular.isDefined(newVal)) {
                self.loadResult();
              }
        });
      }
   };

   self.loadResult();
   self.watchFilters();
   self.setResult();
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


resultModule.directive('resultFooter', function(){
    return {
          restrict: 'E',
          templateUrl: 'results/partials/footer.html'
     };
});

resultModule.directive('resultDetailreport', function(){
    return {
          restrict: 'E',
          templateUrl: 'results/partials/result.body.pap.print.report.html'
     };
});













