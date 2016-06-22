/*jshint strict:false */
'Use strict';


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
  '$q',
  '$rootScope',
  '$timeout',
  'socketio',
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
   lodash,
   $q,
   $rootScope,
   $timeout,
   socketio
 		) {
   socketio.on('result.created', function(result) {
    $scope.services.filterResult();
   });
   

   $scope.services = resultServices;
   $scope.orders = OrderServices;

   $scope.printReport = function(){
    $scope.orders.isPrinting = true;
    var defer = $q.defer();
    $scope.services.printReport().then(function(totalResult){
      $scope.services.printReportList = [];
      if(totalResult.results){
           angular.forEach(totalResult.results, function(item){
             $scope.services.printReportList.push(item);
             $scope.services.totales.costo = parseInt($scope.services.totales.costo) + parseInt(item.costo ? item.costo: 0);
             $scope.services.totales.pago = parseInt($scope.services.totales.pago) + parseInt(item.pago ? item.pago: 0);
             $scope.services.totales.debe = parseInt($scope.services.totales.debe) + parseInt(item.debe ? item.debe: 0);
             $scope.services.totales.seguro = parseInt($scope.services.totales.seguro) + parseInt(item.seguroId ? 1: 0);  
           });
        }
        $timeout(function(){

        $scope.orders.isPrinting = false;
        }, 2000);

        $timeout(function(){
           var printSection = document.getElementById('printSection');
            function printElement(elem) {
                    printSection.innerHTML = '';
                    //document.getElementById(attrs.printElementId);
                     printSection.appendChild(elem);
                     window.print();
                    //location.reload(true);
                }
                if (!printSection) {
                    printSection = document.createElement('div');
                    printSection.id = 'printSection';  
                    document.body.appendChild(printSection);
                }else{
                   printSection = document.createElement('div');
                    printSection.id = 'printSection';  
                    document.body.appendChild(printSection);
                    printSection.innerHTML = '';
                }
                              // printSection.innerHTML = ''

                 var elemToPrint = document.getElementById("printThisElement");
       // //          //elemToPrint.innerHTML = document.getElementById('resultValue').value;
       // //           // var formToHide = document.getElementById('createtemplateForm');
       // //           // formToHide.classList.add('hide');
                
                if (elemToPrint) {
                    printElement(elemToPrint);
                   // formToHide.classList.remove('hide');
                }
        // var printSection = document.createElement('div');

        
        }, 2000);

      
       
    });

     
     return defer.promise;
   };

    $scope.filterDoctor = function(val){
          var data = {
              lastName: val
          };
          var result = [];
          var deferred =  $q.defer();

          $http.post('/doctor/filter', data)
              .success(function(response) {
                  angular.forEach(response, function(card) {
                      result.push(card);
                  });
                  return deferred.resolve(result);
              })
              .error(function(){
                  /* error handling */
              });
          return deferred.promise;
      };

    $scope.loadMore = function(newPage, oldPage){
       $scope.services.page = newPage;
       $scope.services.loadResult(newPage);
    };

    $scope.resetSearchForm = function(){
      // $scope.services.date.startDate = moment;
      // $scope.services.date.endDate = moment();
      $scope.services.resetForm();
    };

      Notify.getMsg('newOrderPost', function(event, result){ 
        $scope.services.filterResult();
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

    $scope.onSelectPatient = function($item, $model, $label){
      $scope.services.search.paciente = $item._id;
      $scope.services.filterResult($item);
    };

     $scope.onSelectDoctor = function($item, $model, $label){
      $scope.services.search.doctor = $item._id;
      $scope.services.filterResult();
    };

    $scope.validatePatient = function(){
       if($scope.services.Searchpaciente === ''){
             $scope.services.search.paciente = '';
             $scope.services.filterResult();

       }
    };

     $scope.validateDoctor = function(){
      console.log("nana");
       if($scope.services.searchDoctor === ''){
             $scope.services.search.doctor = '';
             $scope.services.filterResult();

       }
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
      ///Logica Para Imprimir
      ///Esta es la logica para imprimir los resultados


    //    $scope.users = result.data.results;
    //    $scope.totalUsers = result.data.total;

    //   $http.get('/api/result', {
    //     params: {
    //     page: 1,
    //     count: $scope.totalUsers,
    //     filter: filterLetter,
    //     startDate: startDate,
    //     endDate: dateFilter.endDate
    //   }
    // })
    // .then(function(totalResult) {
    //   $scope.printReport = totalResult.data.results;
    //   $scope.total = {
    //       costo: 0,
    //       pago : 0,
    //       debe: 0,
    //       seguro: 0
    //   };  

    //   for(var i = 0; i < totalResult.data.results.length; i++){
    //     //console.log(totalResult.data.results[i].costo);
    //         $scope.total.costo = parseInt($scope.total.costo) + parseInt(totalResult.data.results[i].costo ? totalResult.data.results[i].costo: 0);
    //         $scope.total.pago = parseInt($scope.total.pago) + parseInt(totalResult.data.results[i].pago ? totalResult.data.results[i].pago: 0);
    //         $scope.total.debe = parseInt($scope.total.debe) + parseInt(totalResult.data.results[i].debe ? totalResult.data.results[i].debe: 0);
    //         $scope.total.seguro = parseInt($scope.total.seguro) + parseInt(totalResult.data.results[i].seguroId ? 1: 0);
    //   }
    //  });
    });
    }
    
     $scope.setResult = function(result){
      $location.path('/result/:' + result._id);
     };

     $scope.setUpdate = function(proc){
       Notify.sendMsg('orderUpdate', {resultInfo: proc});
       $location.path('/orders');
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
            controller: ['$scope', function($scope){
              
            }]
        };

});

resultModule.service('resultServices', ['$q','$timeout', '$http', 'Result', 'Authentication', '$rootScope', 'OrderServices', function($q, $timeout, $http, Result, Authentication, $rootScope, OrderServices){

   var self = {
   'resultList' : [],
   'Results': [],
   'printReportList':[],
   'search': {},
   'date': {},
   'params': {},
   'totales': {},
   'paramsPrint': {},
   'notaResult': null,
   'tecnica': null,
   'hasMore': true,
   'ordersServices': null,
   'page': 1,
   'total': 0,
   'count': 25,
   'selectedResult': null,
   'isPrinting': false,
   'resultado': {},
    test: null,
   'reportName': null,
   'papObservation': null,
   'loadResult': function(){
    if(!OrderServices.filtrarCurrent){
       self.date.startDate = moment().format('YYYY-MM-DD');
       self.date.endDate = moment().format('YYYY-MM-DD');
       self.params.search = {};
     }else{
      self.date.startDate = self.date.startDate ? moment(self.date.startDate).format('YYYY-MM-DD'): '';
      self.date.endDate = self.date.endDate ? moment(self.date.endDate).format('YYYY-MM-DD') : ''
    }
    var defer = $q.defer();
      self.params = {
        'page': self.page,
        'search': self.search,
         startDate : self.date.startDate,
         endDate: self.date.endDate,
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

           // self.printReport();
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
      'printReport': function(){
         var defer = $q.defer();
        self.paramsPrint = {
              'page': 1,
              'search': self.search,
              'count': self.total
           };
        Result.get(self.paramsPrint, function(totalResult){
           self.totales = {
                costo: 0,
                pago : 0,
                debe: 0,
                seguro: 0
            };
           defer.resolve(totalResult);
        });
          return defer.promise;
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
          });

          return defer.promise;
          
      }, 'getDate' : function(param){
          return param.getFullYear() + '-' +  ('0'+(param.getMonth() + 1)).slice(-2)+ '-' + ('0'+(param.getDate())).slice(-2);
      
      }, 'watchFilters': function () {
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
   // self.setResult();
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













