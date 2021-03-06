/*jshint strict:false */
'Use strict';


var ordersModule = angular.module('orders');

// cliente controller
ordersModule.controller('ordersController', [
	'$scope', 
	'$http', 
	'$routeParams',  
	'$location', 
	'Authentication',
	'Doctors',
	'Patients', 
	'Cliente',
	'Orders',
	'Notify',
	'ngTableParams',
	'$modal', 
	'$log',
	'GetResults',
  'OrderServices',
  'resultServices',
	function($scope, $http, $routeParams, $location, Authentication, Doctors, Patients,  Cliente, Orders, Notify, ngTableParams, $modal, $log, GetResults, OrderServices,resultServices){
		this.authentication = Authentication;
      
       $scope.orders = OrderServices;
       $scope.orders.filtrarCurrent = true;
       $scope.services = resultServices;
       $scope.services.date.startDate = '';
       $scope.services.date.endDate = '';
       $scope.services.filterResult();

       $scope.edit = false;
	    // Find a list of cliente
       var params = {
       	  page: 1,            
	      count: 10,
       };

       $scope.data = {
          group1 : 'Ordenes'
       };

       var settings = {
       	total: 0,  
       	counts: [10,15,20],        
	      getData: function($defer, params) {
	            Orders.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
	        });
	      
	        }
       };

    
	  /* jshint ignore:start */
    $scope.tableParams = new ngTableParams( params, settings);
    /* jshint ignore:end */

	  $scope.openExams = function(value, order){
	  	$scope.edit = value;
	  	$scope.orderExam = GetResults.getResultlist(order._id);
	  };

	 $scope.modelDetail = function (size, selectedPatient) {
       //console.log(selectedPatient);
        var modalInstance = $modal.open({
          templateUrl: 'orders/views/orders-list-details.template.html',
          controller: function ($scope, $modalInstance, patient) {
           var cleaned = {};
			   
          $http.get('api/resultfilter',  {
			      params: {
			        orderId: selectedPatient._id
			      }
			    })
			    .then(function(result) {
			       $scope.orderExam = result.data;    
			    });

          $scope.ok = function () {  
              $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
          
          $scope.setResult = function(result){
             $location.path('/result/:' + result._id);
          };
          },
          size: size,
          resolve: {
            patient: function () {
              return selectedPatient;
            }
          }
     });

	   modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	      }, function () {
	        $log.info('Modal dismissed at: ' + new Date());
	      });
	    };


	 }
]);

 ordersModule.controller('ordersCreateController', 
 	['$scope', 
 	 '$http',
 	'$routeParams', 
 	'Doctors',
	'Patients', 
	'Cliente',
	'Procs',
	'Orders',
	'ngTableParams',
 	'Notify',
 	'$mdToast', 
 	'$animate',
 	'$modal', 
	'$log',
	'Cierre',
	'Result',
	'$location',
	'CierreControl',
	'$interval',
	'NotifyPatient',
	'PatientServices',
	'$timeout',
  'DoctorsService',
  'lodash',
  'OrderServices',
  'resultServices',
  '$q',
 	function(
 	 $scope, 
 	 $http,
 	 $routeParams, 
 	 Doctors, 
 	 Patients,  
 	 Cliente,
 	 Procs, 
 	 Orders, 
 	 ngTableParams,
 	 Notify, 
 	 $mdToast, 
 	 $animate,
 	 $modal,
 	 $log,
 	 Cierre,
 	 Result,
 	 $location,
 	 CierreControl,
 	 $interval,
 	 NotifyPatient,
 	 PatientServices,
 	 $timeout,
   DoctorsService,
   lodash,
   OrderServices,
   resultServices,
   $q)
   {
    var createCtrl = this;
     $scope.orders = OrderServices;
     $scope.orders.filtrarCurrent = false;
     $scope.services = resultServices;
     // $scope.services.date.startDate = moment().format('YYYY-MM-DD');
     // $scope.services.date.endDate = moment().format('YYYY-MM-DD');
     // // $scope.services.search = {};
      $scope.services.filterResult();
     //self.date.startDate ? self.date.startDate.format('YYYY-MM-DD'): '';
     //self.date.endDate ? self.date.endDate.format('YYYY-MM-DD') : '';
    
     $scope.loadDropDown = function(){
      //$scope.orders.getprocList();
      // $scope.orders.getClinicaList();
      // $scope.orders.getPatientList();
      // $scope.orders.getDoctorList();
    };


    
    $scope.init = function(){
    
    $scope.orders.selectedOrder.total = $scope.orders.selectedOrder.total ? $scope.orders.selectedOrder.total : 0;
    $scope.orders.selectedOrder.pago = $scope.orders.selectedOrder.pago? $scope.orders.selectedOrder.pago : 0;
    $scope.orders.selectedOrder.debe = $scope.orders.selectedOrder.debe ? $scope.orders.selectedOrder.debe : 0;
    $scope.orders.createdDate = moment().format();   
    $scope.orders.createdDateDoctor = moment().format(); 
    $scope.orders.rSereal ='';
    $scope.orders.createMode = true;
    $scope.orders.clinicaList = $scope.orders.clinicaList ? $scope.orders.clinicaList : [];
    };

    $scope.getDoctors = function(val){
            $http.get( '//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                         address: val,
                         sensor: false
            }})
            .then(function(response){
              var addresses = [];
                angular.forEach(response.data.results, function(item){
                  addresses.push(item.formatted_address);
                });
                console.log(addresses);
                return addresses;
              });
                            //console.log(response);
              // return  response.data.map(function(item){
              //   console.log(item.lastName);
              //     return item.lastName;
              // });

        };

        $scope.solution = function(val){
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


    $scope.test = [
       'A',
       'Lamer',
       'Ernestor'
    ];

    // $scope.clearForm = function(){
    // $scope.orders.selectedOrder = {}; 
    // $scope.orders.selectedDoctor = {};
    // $scope.orders.selectedPatient = {};
    // $scope.orders.createdDate = moment().format();   
    // $scope.orders.createdDateDoctor = moment().format();
    // $scope.orders.rSereal ='';
    // $scope.orders.createMode = true;
    // $scope.orders.clinicaList = [];
    // $scope.orders.selectedOrder.total =  0;
    // $scope.orders.selectedOrder.pago = 0;
    // $scope.orders.selectedOrder.debe = 0;
    // };

    // $scope.$watch('doctor', function(newVal, oldVal){
    //   console.log(newVal);
    // });

    $scope.onSelectDoctor = function($item, $model, $label){
      if($scope.orders.selectedDoctor.clinicaList.length > 0){
      $scope.orders.selectedDoctor.clinicaList = $item.clinicaList;
      $scope.orders.selectedOrder.clinica  =  $scope.orders.selectedDoctor.clinicaList[0].id;
       }
    };

    $scope.onSelectPatient = function(){
       $scope.orders.pSelected = true;
    };

    // $scope.onSelectPatient = function($item, $model, $label){
    //    $scope.services.filterResult();
    // };

    $scope.validatePatient = function(){
      $scope.orders.newPatient = {};
      $scope.orders.newPatientlocations = {};
      if($scope.orders.selectedPatient === ""){
          $scope.orders.selectedPatient = null;
          $scope.orders.pSelected = false;
       }
    };
    
    createCtrl.valuationDatePickerIsOpen = false;
    $scope.$watch(function () {
         return createCtrl.valuationDatePickerIsOpen;
     },function(value){ 
    });

    $scope.log = function(param){
      $scope.orders.createdD = param;
    };

     $scope.$watch(function () {
     return createCtrl.valuationDatePickerIsOpen1;
     },function(value){  
    });
    
    createCtrl.valuationDatePickerOpen = function ($event) {
        if ($event) {
            $event.preventDefault();
            $event.stopPropagation(); // This is the magic
        }
        this.valuationDatePickerIsOpen = true;
    };

    createCtrl.valuationDatePickerOpen1 = function ($event) {
        if ($event) {
            $event.preventDefault();
            $event.stopPropagation(); // This is the magic
        }
        this.valuationDatePickerIsOpen1 = true;
    };
    
     $scope.init();    
     $scope.loadDropDown();
     NotifyPatient.getMsg('patientsaved', function(event, data){ 
   	 $scope.orders.getPatientList().then(function(){
       $scope.orders.selectedOrder.patient = data.patientSavedInfo._id;
       createCtrl.setPatientDetail($scope.orders.selectedOrder.patient);
     }); 
     });

     NotifyPatient.getMsg('doctorUpdate', function(event, doctor){
     $scope.orders.getDoctorList().then(function(){
      $scope.orders.selectedOrder.doctorSelected = doctor.doctorSavedInfo._id;
      $scope.orders.selectedDoctor = $scope.orders.getDoctorById($scope.orders.selectedOrder.doctorSelected);
      if($scope.orders.selectedDoctor.clinicaList.length > 0){
          $scope.orders.clinicaList = $scope.orders.selectedDoctor.clinicaList;
      }
     });
     });

     NotifyPatient.getMsg('procsaved', function(event, data){ 
     $scope.orders.getprocList().then(function(){
       $scope.orders.selectedOrder.procs = data.procSavedInfo._id;
     });
     });

     Notify.getMsg('orderUpdate', function(event, result){ 
      console.log(result);
       $scope.orders.createMode = false;
       $scope.orders.updatedProcs = result.resultInfo;
       console.log(result.resultInfo.doctor);
       $scope.orders.selectedOrder.patient = $scope.orders.updatedProcs.patientReport._id;
       $scope.orders.selectedOrder.nota = $scope.orders.updatedProcs.nota;
       if(result.resultInfo.doctor.clinicaList.length > 0){
        $scope.orders.selectedDoctor = result.resultInfo.doctor;
        $scope.orders.selectedOrder.clinica = $scope.orders.selectedDoctor.clinicaList[0].id = result.resultInfo.clinica;
        // $scope.orders.selectedOrder.clinica  =   
       }

       createCtrl.setPatientDetail(result.resultInfo.patientReport);
       // $scope.orders.setDoctorDetail(result.resultInfo.doctor._id);
       // $scope.orders.selectedOrder.clinica = result.resultInfo.clinica;
       $scope.orders.selectedProc = $scope.orders.getProcById($scope.orders.updatedProcs.procs);
       $scope.orders.createdDate = moment($scope.orders.updatedProcs.created).format('YYYY-MM-DD'); //$scope.orders.getDate(new Date($scope.orders.updatedProcs.created));
       $scope.orders.createdDateDoctor = moment($scope.orders.updatedProcs.createdDateDoctor).format('YYYY-MM-DD');//$scope.orders.updatedProcs.createdDateDoctor ? $scope.orders.getDate(new Date ($scope.orders.updatedProcs.createdDateDoctor)) : $scope.orders.getDate(new Date());
       $scope.orders.orderDetail = [];
       $scope.orders.orderDetail.push({'id': result.resultInfo.rSereal, 'procType':$scope.orders.selectedProc.proType,  'name': $scope.orders.selectedProc.name, 'costo': $scope.orders.updatedProcs.costo ? $scope.orders.updatedProcs.costo : 0, 'pago': $scope.orders.updatedProcs.pago ? $scope.orders.updatedProcs.pago : 0});
       $scope.getTotal();
     });

   $scope.cancelOrder = function(){
       $scope.orders.isDeleting = true;
       $scope.orders.clearForm();
       // $scope.init();
       $scope.orders.isDeleting = false;
       alertify.success('Acción realizada exitosamente!!');
    };

 	 var params = {
       page: 1,            
	     count: 5
    };

   var settings = {
    total: $scope.orders.orderDetail.length, // length of data
    getData: function($defer, params) {
    $defer.resolve($scope.orders.orderDetail.slice((params.page() - 1) * params.count(), params.page() * params.count()));
       }
   };

   $scope.tableParams = new ngTableParams(params, settings);

   $scope.addOrderProcs = function (procs) {
   $http.get('api/resultFilterBy', {params: {rSereal: $scope.orders.rSereal.toUpperCase()}}).then(function(result){
           if(result.data.length === 0){
             var sereal = $scope.orders.setProcDetail(procs);
              $scope.orders.orderDetail = [];
              $scope.orders.orderDetail.push({'id': $scope.orders.rSereal, 'procType':$scope.orders.selectedProc.proType,  'name': $scope.orders.selectedProc.name, 'costo': $scope.orders.selectedProc.costo ? $scope.orders.selectedProc.costo : 0, 'pago': $scope.orders.selectedProc.pago ? $scope.orders.selectedProc.pago : 0});
              $scope.getTotal();
          }else{
             alertify.error($scope.orders.rSereal + ' ya existe');
          }
    });
 	};
  
  this.setPatientDetail = function(patientInfo){
        $scope.orders.newPatient = {};
        $scope.orders.selectedPatient = patientInfo;
   };

   createCtrl.setNewPatient = function(){
         $scope.orders.selectedPatient = null;
         $scope.orders.pSelected = false;
   };

  this.setClinicaDetail = function(clinicaparamId){
        var sClinica = clinicaparamId;
        $scope.orders.selectedClinica = $scope.orders.getClinicaById(sClinica);     
   };

   $scope.setProcsDetail = function(procs){
        $scope.orders.setProcDetail(procs);
   };
    
    $scope.getTotal = function(){
          $scope.orders.selectedOrder.total = 0;
          $scope.orders.selectedOrder.pago = 0;
          $scope.orders.selectedOrder.debe = 0;
          for(var i = 0; i < $scope.orders.orderDetail.length; i++ ){
          	$scope.orderd = $scope.orders.orderDetail[i];
          	$scope.orders.selectedOrder.total += Number($scope.orderd.costo ? $scope.orderd.costo : 0 );
            $scope.orders.selectedOrder.pago += Number($scope.orderd.pago ? $scope.orderd.pago : 0 );
          }   	
          $scope.orders.selectedOrder.debe = Number($scope.orders.selectedOrder.pago > $scope.orders.selectedOrder.total ? 0 :  $scope.orders.selectedOrder.total - $scope.orders.selectedOrder.pago);
    };

   this.deleteProcs = function(index) { 
     $scope.orders.orderDetail.splice(index, 1);
     $scope.getTotal();
   };

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

  $scope.modelRemove = function (size, selectedcliente) {
		    var modalInstance = $modal.open({
		      templateUrl: 'orders/views/orders-cancel.template.html',
		      controller: function ($scope, $modalInstance) {
                  $scope.ok = function () {  
                  //console.log('works');                 
                  $modalInstance.close();
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };

		      },
		      size: size
	});
  modalInstance.result.then(function (selectedcliente) {

	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

  // Create new Orden
 	this.create = function(param) {
   if($scope.orders.newPatient.patientFirstName){
      $scope.orders.createNewPatient().then(function(){
              $scope.orders.create(param).then(function(data){               
                    $scope.orders.clearForm();
                    Notify.sendMsg('newOrderPost', {'id': 'nada'});             
            });
        });

    }else{
    $scope.orders.create(param).then(function(data){
            $scope.orders.clearForm();
            Notify.sendMsg('newOrderPost', {'id': 'nada'}); 
            alertify.success('Acción realizada exitosamente!!'); 
    });
    }
 	};
	}
 ]);

 ordersModule.directive('autoComplete', function(){
 	   return{
           
 	   };
 });
			
ordersModule.directive('orderList', ['Orders', 'Notify', function(Orders, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'orders/views/orders-list.template.html',
     link: function(scope, element, attr){          // when a new cliente 
            Notify.getMsg('newPis', function(event, data){                 	
         });
    }
   };
 }]);

ordersModule.directive('resultList', ['Orders', 'Notify', 'Result', function(Orders, Notify, Result){
    return {
    restrict: 'E',
    transclude: true,
    scope: {
      filterDate: '='
    },
    templateUrl: 'results/views/result-list.template.html',
     link: function(scope, element, attr){          // when a new cliente 
            Notify.getMsg('newPis', function(event, data){                 	
         });
    }
   };
 }]);

ordersModule.directive('resultCurrentList', ['Orders', 'Notify', 'Result', function(Orders, Notify, Result){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'results/views/resultcurrent-list.template.html',
     link: function(scope, element, attr){          // when a new cliente 
            Notify.getMsg('newPis', function(event, data){                  
         });
    }
   };
 }]);

ordersModule.service('OrderServices', ['$q','$timeout', '$http', 'Procs', 'Orders', 'Result', 'Patients', 'Cliente', function($q, $timeout, $http, Procs, Orders, Result, Patients, Cliente){
      var self = {
        'bInfo': null,
        'blInfo': null,
        'pInfo': null,
        'bflag': false,
        'blFlag': false,
         clinic: null,
        'noClinica' : false,
        'searchPatient': [],
        'newPatient': {},
        'isDeleting': false,
        'isPrinting': false,
        'pSelected': null,
        'newPatientlocations': null,
        'createMode': true,
        'createdD' : null,
        'createdDate': '',
        'createdDateDoctor': null,
        'updatedProcs': null, 
        'selectedProc': null,
        'isSaving': false,
        'filtrarCurrent': false,
        'seguroList': [],
        'clinicaList': [],
        'selectedOrder': null,
        'rSereal': null,
        'selectedDoctor': null,
        'selectedClinica': null,
        'selectedPatient': null,
        'orderResult': null,
        'rpaciente': {},
        'bCunter': 0,
        'blCunter': 0,
        'pCunter': 0,
        'procList': [],
        'reportSave': [],
        'doctorList': [],
        'patientList': [],
        'listadoClinica':[],
        'orderDetail': [],
        'clearForm': function(){
          self.selectedPatient = {};
          self.newPatient = {};
          self.updatedProcs = null;
          self.rSereal = null;
          self.isSaving = false;
          self.createMode = true;
          self.noClinica = false;
          self.newPatientlocations = null;
          self.selectedOrder = {}; 
          self.selectedDoctor = null;
          self.selectedPatient = null;
          self.pSelected = null;
          self.clinicaList = [];
          self.orderDetail = [];
          self.selectedOrder.total = 0;
          self.selectedOrder.pago =  0;
          self.selectedOrder.debe = 0;
          self.createdDate = moment().format();   
          self.createdDateDoctor = moment().format(); 
        },
        'createNewPatient': function(){
            var defer = $q.defer();
            var PatientCI = {
              tipo: self.newPatient.PatientCI ?  'Cedula' : '', 
              value: self.newPatient.PatientCI ? self.newPatient.PatientCI.tipovalue : ''
            };
            
            self.newPatient.PatientCI = PatientCI;
            if(self.newPatientlocations){
            self.newPatient.locations =  self.newPatientlocations ? self.newPatientlocations._id: null;
             }
            var patient = new Patients(self.newPatient);
            patient.$save(function(data){
              
              self.selectedOrder.patient = data._id;
              self.selectedPatient = data;
              // self.selectedPatient.locations = self.newPatient.locations;
              console.log(self.selectedPatient);
              //self.selectedPatient.
              // self.getPatientList().then(function(){
              //   self.selectedPatient = self.getPatientById(self.selectedOrder.patient);               
              // });

              defer.resolve(data);        
              
          }, function(err){
              defer.reject();
            });
            return defer.promise;
        },
        'saveReport': function(report){
          var defer = $q.defer();
          report.$save(function(response){
              // var newCounter = 0;
              // if(response.tipomuestra === 'B'){
              //   newCounter = self.bCunter;
              // }else if(response.tipomuestra === 'BL'){
              //   newCounter = self.blCunter;
              //   self.blFlag = true;
              // }else{
              //   newCounter = self.pCunter;
              // }

              // var info = {
              //         year: self.bInfo[0].year,
              //         month: self.bInfo[0].month,
              //         proType: response.tipomuestra,
              //         newCount: newCounter
              //    };        
              //     $http.post('/api/count', {info: info})
              //     .success(function(data){
              //      self.getBL();
              //      self.getB();
              //      self.getP();
              //     }).error(function(err){
              //  });

               defer.resolve();
             }, function(errorResponse){  
              defer.reject(errorResponse);
            });

        },'getDoctors': function(val){
            $http.get( '//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                         address: val,
                         sensor: false
            }})
            .then(function(response){
              var addresses = [];
                angular.forEach(response.data.results, function(item){
                  addresses.push(item.formatted_address);
                });
                console.log(addresses);
                return addresses;
              });
                            //console.log(response);
              // return  response.data.map(function(item){
              //   console.log(item.lastName);
              //     return item.lastName;
              // });

        },'create': function(order){
         self.isSaving = true; 
         var defer = $q.defer();
         if(self.createMode){
         var orderSave = new Orders({
               proclist: order,
               nota: self.selectedOrder.nota,
               total: self.selectedOrder.total,
               patientName:self.selectedPatient.patientFirstName + ' ' + self.selectedPatient.patientLastName,
               patientId: self.selectedPatient.patientId,
               doctorName : self.selectedDoctor.firstName + ' ' + self.selectedDoctor.lastName,
               patientEdad : self.selectedPatient ?  self.selectedPatient.patientEdad : null,
               cliente: self.selectedOrder.clinica,
               doctor: self.selectedDoctor._id,
               patients: self.selectedPatient._id,
               created: self.getDate(new Date(self.createdDate))
           });
          
          orderSave.$save(function(data){
            self.orderResult = data;
            console.log(self.orderResult);
            if(self.selectedPatient.locations){
            if(Object.keys(self.selectedPatient.locations).length === 0){
              self.selectedPatient.locations = self.newPatientlocations;
            }
          }

            for(var i = 0; i < self.orderResult.proclist.length; i++ ){
             var report = new Result({
              rSereal: self.orderResult.proclist[i].id,
              tipomuestra : self.orderResult.proclist[i].procType,
              tipomuestraDesc: self.orderResult.proclist[i].name,
              reportStatus: 'Pendiente',
              orders: self.orderResult._id,
              costo: self.orderResult.proclist[i].costo,
              pago: self.orderResult.proclist[i].pago,
              debe: self.orderResult.proclist[i].pago > self.orderResult.proclist[i].costo ? 0 :  self.orderResult.proclist[i].costo - self.orderResult.proclist[i].pago,
              patientReport: self.selectedPatient._id,
              seguroId : self.selectedPatient.locations ? self.selectedPatient.locations._id: null,
              doctor: self.selectedDoctor._id,
              clinica : self.selectedOrder.clinica,
              seguroDesc : self.selectedPatient.locations ? self.selectedPatient.locations.name: '',
              created: self.getDate(new Date(self.createdDate)),
              createdDateDoctor: self.getDate(new Date(self.createdDateDoctor)),
              procs: self.selectedProc._id
            });
             self.saveReport(report);
            }
            defer.resolve();
                
            return defer.promise;

           }, function(error){          
           });
           }else{

            var report = new Result({
              _id: self.updatedProcs._id,
              costo: self.selectedOrder.total,
              pago: self.selectedOrder.pago,
              debe: self.selectedOrder.debe,
              patientReport: self.selectedPatient._id,
              seguroId : self.selectedPatient.locations ? self.selectedPatient.locations._id: null,
              doctor: self.selectedDoctor._id,
              clinica : self.selectedOrder.clinica,
              nota: self.selectedOrder.nota,
              reportStatus: self.updatedProcs.reportStatus,
              seguroDesc : self.selectedPatient.locations ? self.selectedPatient.locations.name: '',
              created: moment(self.createdDate).format('YYYY-MM-DD'),
              createdDateDoctor:  moment(self.createdDateDoctor).format('YYYY-MM-DD')
            });
            report.$update(function(){
               self.isSaving = false;
               self.clearForm();
               defer.resolve();
               alertify.success('Acción realizada exitosamente!!');       
            }, function(){
              self.isSaving = false; 
              alertify.error('Se ha producido un error'); 
              defer.reject(errorResponse);
            });
           }
           return defer.promise;

        },'getB': function(){
           $http.post('/api/getMaxB', {type: 'B'}).
              success(function(result){
                self.bInfo = result;
              }).error(function(err){
          });
        },'getBL': function(){
           $http.post('/api/getMaxB', {type: 'BL'}).
              success(function(result){
                self.blInfo = result;
              }).error(function(err){
          });
        },
        'getP': function(){
           $http.post('/api/getMaxB', {type: 'P'}).
              success(function(result){
                self.pInfo = result;
              }).error(function(err){
           });
        },
        'getprocList': function(){
           var defer  = $q.defer();
          $http.post('procs/getList').
            success(function(data){
              if(data){
                self.procList = [];
                angular.forEach(data, function(dataresult){
                  self.procList.push(dataresult);
                });
                defer.resolve();
              }
           }).
           error(function(err){
            console.log(err);
         });
         return defer.promise;
        },
        'getDoctorList': function(){
           var defer  = $q.defer();
          $http.post('doctor/getList').
            success(function(data){
            if(data){
              self.doctorList = [];
                angular.forEach(data, function(dataresult){
                  self.doctorList.push(dataresult);
                });
                defer.resolve();
              }
             }).
             error(function(err){
           });
          return defer.promise;
        },
        'getPatientList': function(){
          var defer  = $q.defer();
          $http.post('patient/getList').
            success(function(data){
            if(data){
              self.patientList = [];
                angular.forEach(data, function(dataresult){
                  self.patientList.push(dataresult);
                });
                defer.resolve();
              }
             }).
             error(function(err){
           });
          return defer.promise;
        },
        'getClinicaList': function(){
          $http.post('cliente/getList').
            success(function(data){
            if(data){
              self.listadoClinica = [];
                angular.forEach(data, function(dataresult){
                  self.listadoClinica.push(dataresult);
                });
              }
             }).
             error(function(err){
           });
        },
        'setProcDetail': function(id){
          self.selectedProc = self.getProcById(id);
          if(self.selectedProc){
             $http.post('/api/resultMax', {resultType : self.selectedProc.proType}).then(function(result){
                  self.rSereal = result.data[0].rSereal;
             });
          }
        },'getSeguroList': function(){
         $http.post('locations/getList').
          success(function(data){ 
            if(data){
              self.seguroList = [];
                angular.forEach(data, function(dataresult){
                  self.seguroList.push(dataresult);
                });
              }
           }).
           error(function(err){
         });
     
          // self.seguroList = Cliente.get();

        },'getProcById': function(procId){
          // self.getprocList();
          for (var i = 0; i < self.procList.length; i++) {
              var obj = self.procList[i];
              if (obj._id === procId) {
                return obj;
            }
          }
        },
        'getDoctorById': function(clinicaId){
          for (var i = 0; i < self.doctorList.length; i++) {
              var obj = self.doctorList[i];
              if (obj._id === clinicaId) {
                return obj;
            }
          }
        },
        'getClinicaById': function(clinicaId){
          for (var i = 0; i < self.listadoClinica.length; i++) {
              var obj = self.listadoClinica[i];
              if (obj._id === clinicaId) {
                return obj;
            }
          }
        },
        'getPatientById': function(patientId){
          for (var i = 0; i < self.patientList.length; i++) {
              var obj = self.patientList[i];
              if (obj._id === patientId) {
                return obj;
            }
          }
        }, 'setDoctorDetail' : function(doctorparamId){

          if(doctorparamId){
           self.getDoctorList().then(function(){
           self.selectedOrder.doctor = doctorparamId;
           self.selectedDoctor = self.getDoctorById(doctorparamId);   
           if(self.selectedDoctor){
            if(self.selectedDoctor.clinicaList.length > 0){
              // self.noClinica = false;
              //   self.clinicaList = self.selectedDoctor.clinicaList;
              //   if(self.updatedProcs){
              //     self.selectedOrder.clinica = self.updatedProcs.clinica;
              //   }else{
              //     self.selectedOrder.clinica = self.clinicaList ? self.clinicaList[0].id : '';
              //     self.selectedClinica = self.getClinicaById(self.selectedOrder.clinica);     
              //   }
            }else{
               self.noClinica = true;
               self.selectedOrder.clinica = '';
               self.selectedClinica = '';
               self.clinicaList = [];
            }
          }
         });
        }
        }, 'getDate' : function(param){
          return param.getFullYear() + '-' +  ('0'+(param.getMonth() + 1)).slice(-2)+ '-' + ('0'+(param.getDate())).slice(-2);
        }, 'getTimeZone': function(param){
          return new Date(param.getTime() + param.getTimezoneOffset()*60000);
        },getPatientFilter : function(val){
          var data = {
              lastName: val
          };
          var result = [];
          var deferred =  $q.defer();

          $http.post('/patient/filter', data)
              .success(function(response) {
                  angular.forEach(response, function(patient) {
                      result.push(patient);
                  });
                  return deferred.resolve(result);
              })
              .error(function(){
                  /* error handling */
              });
          return deferred.promise;
      }

      },getDoctorFilter = function(val){
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
      self.getSeguroList();
      self.selectedOrder = {};
      // self.getDoctorList();
      self.getprocList();
      self.getB();
      self.getP();
      self.getBL();
      // self.getPatientList();
      return self;
}]);
