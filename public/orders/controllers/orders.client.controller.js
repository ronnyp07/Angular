'use strict';

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
	function($scope, $http, $routeParams, $location, Authentication, Doctors, Patients,  Cliente, Orders, Notify, ngTableParams, $modal, $log, GetResults) {
		this.authentication = Authentication;

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

    
	$scope.tableParams = new ngTableParams( params, settings);
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
   OrderServices )
   {
    var createCtrl = this;
    
    $scope.init = function(){
    $scope.orderDetail = [];
    $scope.orders = OrderServices;
    $scope.orders.selectedOrder = {};
    $scope.orders.selectedDoctor = {};
    $scope.orders.getDoctorList();
    $scope.orders.getprocList();
    $scope.orders.getClinicaList();
    $scope.orders.getPatientList();
    $scope.orders.selectedPatient = {};
    $scope.orders.selectedOrder.total = 0;
    $scope.orders.selectedOrder.pago = 0;
    $scope.orders.selectedOrder.debe = 0;
    $scope.orders.createdDate = Date.now();
    $scope.orders.rSereal ="";
    $scope.orders.createMode = true;
    $scope.orders.clinicaList = [];
    };
    createCtrl.valuationDatePickerIsOpen = false;
    $scope.$watch(function () {
         return createCtrl.valuationDatePickerIsOpen;
     },function(value){  
    });
    
    createCtrl.valuationDatePickerOpen = function ($event) {
        if ($event) {
            $event.preventDefault();
            $event.stopPropagation(); // This is the magic
        }
        this.valuationDatePickerIsOpen = true;
    };
    
     $scope.init();    
     NotifyPatient.getMsg('patientsaved', function(event, data){ 
   	 $scope.orders.getPatientList();
   	 $scope.orders.selectedOrder.patient = data.patientSavedInfo._id;
   	 createCtrl.setPatientDetail($scope.orders.selectedOrder.patient);
     });

     NotifyPatient.getMsg('doctorsaved', function(event, doctor){
     $scope.orders.getDoctorList();
     $scope.orders.selectedOrder.doctorSelected = doctor.doctorSavedInfo._id;
     $scope.orders.selectedDoctor = doctor.doctorSavedInfo;
      if($scope.orders.selectedDoctor.clinicaList.length >= 0){
          $scope.orders.clinicaList = $scope.orders.selectedDoctor.clinicaList;
      }
     });

     NotifyPatient.getMsg('procsaved', function(event, data){ 
     $scope.orders.getprocList();
     $scope.orders.selectedOrder.procs = data.procSavedInfo._id;
     });

     Notify.getMsg('orderUpdate', function(event, result){ 
       $scope.orders.createMode = false;
       $scope.orders.updatedProcs = result.resultInfo;
       $scope.orders.selectedOrder.patient = $scope.orders.updatedProcs.patientReport._id;
       $scope.orders.selectedOrder.nota = $scope.orders.updatedProcs.nota;
       createCtrl.setPatientDetail($scope.orders.selectedOrder.patient);
       createCtrl.setDoctorDetail(result.resultInfo.doctor._id);
       $scope.orders.selectedOrder.clinica = result.resultInfo.clinica;
       $scope.orders.selectedProc = $scope.orders.getProcById($scope.orders.updatedProcs.procs);
       $scope.orders.createdDate = $scope.orders.updatedProcs.created;
       $scope.orderDetail = [];
       $scope.orderDetail.push({'id': result.resultInfo.rSereal, 'procType':$scope.orders.selectedProc.proType,  'name': $scope.orders.selectedProc.name, 'costo': $scope.orders.updatedProcs.costo ? $scope.orders.updatedProcs.costo : 0, 'pago': $scope.orders.updatedProcs.pago ? $scope.orders.updatedProcs.pago : 0});
       $scope.getTotal();
     });

   $scope.cancelOrder = function(){
       $scope.orders.isDeleting = true;
       $scope.orders.clearForm();
       $scope.init();
       $timeout(function(){
          $scope.orders.isDeleting = false;
           alertify.success('Acción realizada exitosamente!!');
       }, 2000);
    };

 	 var params = {
       page: 1,            
	     count: 5
    };

   var settings = {
    total: $scope.orderDetail.length, // length of data
    getData: function($defer, params) {
    $defer.resolve($scope.orderDetail.slice((params.page() - 1) * params.count(), params.page() * params.count()));
       }
   };

   $scope.tableParams = new ngTableParams(params, settings);
   $scope.addOrderProcs = function (procs) {

    $http.get('api/resultFilterBy', {params: {rSereal: $scope.orders.rSereal}}).then(function(result){
           if(result.data.length === 0){
             var sereal = $scope.orders.setProcDetail(procs);
              $scope.orderDetail = [];
              $scope.orderDetail.push({'id': $scope.orders.rSereal, 'procType':$scope.orders.selectedProc.proType,  'name': $scope.orders.selectedProc.name, 'costo': $scope.orders.selectedProc.costo ? $scope.orders.selectedProc.costo : 0, 'pago': $scope.orders.selectedProc.pago ? $scope.orders.selectedProc.pago : 0});
              $scope.getTotal();
          }else{
             alertify.error($scope.orders.rSereal + ' ya existe')
          };
    });
   
 		
 	};
  
  this.setPatientDetail = function(patientParam){
        var sPatient = patientParam;
        $scope.orders.newPatient = {};
        $scope.orders.selectedPatient = $scope.orders.getPatientById(sPatient);
   };

   createCtrl.setNewPatient = function(){
        $scope.orders.selectedPatient = {};
        $scope.orders.selectedOrder.patient = {};
   };

   

  this.setDoctorDetail = function(doctorparamId){
      var sDoctor = doctorparamId;
     $scope.orders.selectedOrder.doctor = doctorparamId;
     $scope.orders.selectedDoctor = $scope.orders.getDoctorById(sDoctor);   
     if($scope.orders.selectedDoctor){
      if($scope.orders.selectedDoctor.clinicaList.length >= 0){
          $scope.orders.clinicaList = $scope.orders.selectedDoctor.clinicaList;
          if($scope.orders.selectedOrder.clinica){
          $scope.orders.selectedOrder.clinica = $scope.orders.updatedProcs.clinica._id;
        }
      }
    }
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
          for(var i = 0; i < $scope.orderDetail.length; i++ ){
          	$scope.orderd = $scope.orderDetail[i];
          	$scope.orders.selectedOrder.total += Number($scope.orderd.costo ? $scope.orderd.costo : 0 );
            $scope.orders.selectedOrder.pago += Number($scope.orderd.pago ? $scope.orderd.pago : 0 );
          }   	
          $scope.orders.selectedOrder.debe = Number($scope.orders.selectedOrder.pago > $scope.orders.selectedOrder.total ? 0 :  $scope.orders.selectedOrder.total - $scope.orders.selectedOrder.pago);
    };

   this.deleteProcs = function(index) { 
     $scope.orderDetail.splice(index, 1);
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
               $scope.orders.create(param).then(function(){
               $scope.init();
               });
        });      
    }else{
    $scope.orders.create(param).then(function(){
      $scope.init();
      Notify.sendMsg('newOrderPost', {'id': 'nada'});
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
    templateUrl: 'results/views/result-list.template.html',
     link: function(scope, element, attr){          // when a new cliente 
            Notify.getMsg('newPis', function(event, data){                 	
         });
    }
   };
 }]);

ordersModule.service('OrderServices', ['$q', '$http', 'Procs', 'Orders', 'Result', 'Patients', function($q, $http, Procs, Orders, Result, Patients){
      var self = {
        'bInfo': null,
        'blInfo': null,
        'pInfo': null,
        'bflag': false,
        'blFlag': false,
        'newPatient': {},
        'isDeleting': false,
        'createMode': true,
        'createdDate': null,
        'updatedProcs': null, 
        'selectedProc': null,
        'isSaving': false,
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
          self.procList = [];
          self.selectedPatient = {};
          self.getprocList();
          self.createdDate = null;
          self.rSereal = null;
          self.isSaving = false;
          self.createMode = true; 
        },
        'createNewPatient': function(){
            var defer = $q.defer();
            var patient = new Patients(self.newPatient);
            patient.$save(function(data){
              self.selectedPatient = data;
              self.selectedOrder.patient = data._id;
              defer.resolve(data);
            }, function(err){
              defer.reject();
            });
            return defer.promise;
        },
        'create': function(order){
         var defer = $q.defer();
         self.isSaving = true; 
         if(self.createMode){
         var orderSave = new Orders({
               proclist: order,
               nota: self.selectedOrder.nota,
               total: self.selectedOrder.total,
               patientName:self.selectedPatient.patientFirstName + ' ' + self.selectedPatient.patientLastName,
               patientId: self.selectedPatient.patientId,
               clienteName: self.selectedClinica.name,
               doctorName : self.selectedDoctor.firstName + ' ' + self.selectedDoctor.lastName,
               patientEdad : self.selectedPatient ?  self.selectedPatient.patientEdad : null,
               cliente: self.selectedOrder.clinica,
               doctor: self.selectedOrder.doctor,
               patients: self.selectedOrder.patient,
               created: self.createdDate
           });
            orderSave.$save(function(data){
            self.orderResult = data;
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
              patientReport: self.orderResult.patients,
              seguroId : self.selectedPatient.locations ? self.selectedPatient.locations._id: null,
              doctor: self.orderResult.doctor,
              clinica : self.orderResult.cliente,
              seguroDesc : self.selectedPatient.locations ? self.selectedPatient.locations.name: '',
              created: self.createdDate,
              procs: self.selectedProc._id
            });
            report.$save(function(response){
              var newCounter = 0;
              if(response.tipomuestra === 'B'){
                newCounter = self.bCunter;
              }else if(response.tipomuestra === 'BL'){
                newCounter = self.blCunter;
                self.blFlag = true;
              }else{
                newCounter = self.pCunter;
              }

              var info = {
                      year: self.bInfo[0].year,
                      month: self.bInfo[0].month,
                      proType: response.tipomuestra,
                      newCount: newCounter
                 };        
                  $http.post('/api/count', {info: info})
                  .success(function(data){
                   self.getBL();
                   self.getB();
                   self.getP();
                  }).error(function(err){
               });

               self.clearForm();
               alertify.success('Acción realizada exitosamente!!');
               defer.resolve();
             }, function(errorResponse){  
              defer.reject(errorResponse);
            });
           }
          
           }, function(error){          
           });
          
            }else{
            var report = new Result({
              _id: self.updatedProcs._id,
              costo: self.selectedOrder.total,
              pago: self.selectedOrder.pago,
              debe: self.selectedOrder.pago > self.selectedOrder.total ? 0 :  self.selectedOrder.total - self.selectedOrder.pago,
              patientReport: self.selectedPatient._id,
              seguroId : self.selectedPatient.locations ? self.selectedPatient.locations._id: null,
              doctor: self.selectedDoctor._id,
              clinica : self.selectedOrder.clinica,
              nota: self.selectedOrder.nota,
              reportStatus: self.updatedProcs.reportStatus,
              seguroDesc : self.selectedPatient.locations ? self.selectedPatient.locations.name: null,
              created: self.createdDate
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
          $http.post('procs/getList').
            success(function(data){
              if(data){
                self.procList = [];
                angular.forEach(data, function(dataresult){
                  self.procList.push(dataresult);
                });
              }
           }).
           error(function(err){
            console.log(err);
         });
        },
        'getDoctorList': function(){
          $http.post('doctor/getList').
            success(function(data){
            if(data){
              self.doctorList = [];
                angular.forEach(data, function(dataresult){
                  self.doctorList.push(dataresult);
                });
              }
             }).
             error(function(err){
           });
        },
        'getPatientList': function(){
          $http.post('patient/getList').
            success(function(data){
            if(data){
              self.patientList = [];
                angular.forEach(data, function(dataresult){
                  self.patientList.push(dataresult);
                });
              }
             }).
             error(function(err){
           });
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
              // if(self.selectedProc.proType === 'B'){
              //     if(self.bflag === false){
              //       self.bCunter = parseInt(self.bInfo[0].counter) + 1;
              //       var sereal = self.bInfo[0].month + self.bInfo[0].proType  + self.bInfo[0].year.substring(2, 4) + '-' + self.bCunter;
              //       return sereal;
              //     }
              // }else if(self.selectedProc.proType === 'BL'){
              //       self.blCunter = parseInt(self.blInfo[0].counter) + 1;
              //       var blSereal = self.bInfo[0].month + self.blInfo[0].proType  + self.blInfo[0].year.substring(2, 4) + '-' + self.blCunter;
              //       return blSereal;
              // }else{
              //     self.pCunter = parseInt(self.pInfo[0].counter) + 1;
              //       var pSereal =  'P' + self.pInfo[0].year.substring(2, 4) + '-' + self.pCunter;
              //     return pSereal;
          }
        },
        'getProcById': function(procId){
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
        }
      };
      self.selectedOrder = {};
      self.getDoctorList();
      self.getprocList();
      self.getB();
      self.getP();
      self.getBL();
      self.getClinicaList();
      self.getPatientList();
      return self;
}]);
