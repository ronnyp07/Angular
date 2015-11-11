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
	   // NotifyPatient.getMsg('updated', function(event, data){
    //      getPatientList();
    //      getDoctorList();
    //      getClienteList();
    //      alertify.success('Acción realizada exitosamente!! !!'); 
    //   });


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

			   // $scope.orderExam = cleaned;
			    

         // $scope.orderExam = GetResults.getResultlist(selectedPatient._id);
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
 	 $timeout
 		) {
    
   //Auto Cierre
    var createCtrl = this;
    $scope.rcliente = {};
    $scope.rpaciente = {};
    $scope.rdoctor = {};
    $scope.rprocs = {};
    $scope.isNotSave = false;
    $scope.BcounterIncrement = 0;
    $scope.PcounterIncrement = 0;
    $scope.BLcounterIncrement = 0;
    $scope.addbAvalilable = false;
    $scope.currentB = '';
    getPatientList();
    getDoctorList();
    getClienteList();

 	$scope.orderDetail = [];
 	$scope.rpaciente.aseguradora = '';
 	
    $http.post('procs/getList').
    success(function(data){
       $scope.procedimeinto = data;     
    }).error(function(err){
	   console.log(err);
    });
    
     $scope.isSaving = false;
     NotifyPatient.getMsg('patientsaved', function(event, data){ 
     	 getPatientList();
     	 createCtrl.patient = data.patientSavedInfo._id;
         $scope.rpaciente.aseguradora = data.patientSavedInfo.DoctorTelefono;
         $scope.rpaciente.polisa = data.patientSavedInfo.patientPolisa;
         $scope.rpaciente.telefono = data.patientSavedInfo.patientTelefono;
         $scope.rpaciente.ID = data.patientSavedInfo.patientId;
         alertify.success('Acción realizada exitosamente!! !!');
      });

     NotifyPatient.getMsg('doctorsaved', function(event, data ){
     	getDoctorList();

     	$scope.setDoctorDetail(data.doctorSavedInfo._id);
     	$scope.doctorName = data.doctorSavedInfo.firstName + ' ' + data.doctorSavedInfo.lastName;
		$scope.rdoctor.ID = data.doctorSavedInfo.DoctorId;
		createCtrl.doctors = data.doctorSavedInfo._id;
		$scope.rdoctor.telefono = data.doctorSavedInfo.DoctorTelefono;
		alertify.success('Acción realizada exitosamente!! !!');
     });

      NotifyPatient.getMsg('clientesaved', function(event, data ){
     	getClienteList();
     	createCtrl.clientes = data.clienteSavedInfo._id;
		$scope.rcliente.ID = data.clienteSavedInfo.ClienteId;
		$scope.rcliente.IC = data.clienteSavedInfo.clienteRNC;
		$scope.rcliente.telefono = data.clienteSavedInfo.clienteTelefono;
		alertify.success('Acción realizada exitosamente!! !!');
     });


     
	$scope.testThis = function(){
         getPatientList();
         getDoctorList();
         getClienteList();
         createCtrl.clientes = '';
         createCtrl.patient = '';
         createCtrl.doctors = '';

    };

    function getPatientList(){
    $http.post('patient/getList').
    success(function(data){
       $scope.paciente = data;
     }).
     error(function(err){
    });
    }

   function getDoctorList(){
   $http.post('doctor/getList').
    success(function(data){
    $scope.doctor = data;
     }).
     error(function(err){
    });
    };

    function getClienteList(){
    $http.post('cliente/getList').
    success(function(data){
    $scope.cliente = data;
    console.log(procs.selectedIndex);
     }).
     error(function(err){
    });
    };

 //Carga el listando de los procedimientos
  $scope.getProcInit = function(){ 
 	$http.post('procs/getList').
		     success(function(data){
        $scope.procedimeinto = data;  
		     }).
		     error(function(err){
		     	console.log(err);
       });
      };

 	var params = {
       page: 1,            
	   count: 5
    }

       var settings = {
        total: $scope.orderDetail.length, // length of data
        getData: function($defer, params) {
        $defer.resolve($scope.orderDetail.slice((params.page() - 1) * params.count(), params.page() * params.count()));
           }
       };
 
    $scope.tableParams = new ngTableParams(params, settings);
   

   $scope.doSearch = function () {
        $scope.tableParams.reload();
         console.log($scope.tableParams);
    };  
 	 //$scope.getTotal();


 	$scope.addOrderProcs = function (procs) {

 		Procs.get({ procsId: procs }, function(procsResult){
            var costo = 0;   
            console.log($scope.rprocs.ID);
		 $scope.orderDetail.push({"id": $scope.nserie, "procType":procsResult.proType,  "name": procsResult.name, "costo": procsResult.costo})
	     
         //console.log($scope.orderDetail);
	     $scope.getProcInit();
	     $scope.doSearch();

	     if(procsResult.proType == 'B'){
	     	 if($scope.InitFlag == true){
	     	 	$scope.BcounterIncrement = $scope.BcounterIncrement + 1;
	     	 	$scope.InitFlag = false;
	     	 	console.log($scope.BcounterIncrement);
	     	 } else {
	     	 	$scope.BcounterIncrement +=  1;
	
	     	 }    	
	     	//$scope.Bcounter = $scope.Bcounter + $scope.BcounterIncrement;
	     	$scope.flag = true;
	     }else if (procsResult.proType === 'BL'){
	     	if($scope.InitFlag === true){
	     	 	$scope.BLcounterIncrement = $scope.BLcounterIncrement + 1;
	     	 	$scope.InitFlag = false;
	     	 } else {
	     	 	$scope.BLcounterIncrement +=  1;
	     	 } 
	     	 $scope.BLflag = true;     	
	     }else {
	     	if($scope.InitFlag ===true){
	     	 	$scope.PcounterIncrement = $scope.PcounterIncrement + 1;
	     	 	$scope.InitFlag = false;
	     	 } else {
	     	 	$scope.PcounterIncrement +=  1;
	     	 }    	
	     	$scope.Pflag = true;
	     }

	     $scope.getTotal();
	     
	     console.log($scope.counter);
	    });
 		//Add the detail to the order array		
 		 //$scope.clearProcForm();
 		
 	};

    this.setClienteDetail = function(){
    var sCliente = $scope.clientes;
    $scope.getCliente(sCliente);
    };

    $scope.getCliente = function(cliente){
    	Cliente.get({ clienteId: createCtrl.patient }, function(clienteResult){
    	$scope.rcliente._id = clienteResult._id;
		$scope.rcliente.ID = clienteResult.clienteId;
	    $scope.rcliente.name = clienteResult.name;		
		$scope.rcliente.telefono = clienteResult.clienteTelefono;
		$scope.rcliente.IC = clienteResult.clienteRNC;
	    });
    };

    $scope.clearClientForm = function(){
    	createCtrl.cliente = Cliente.get();
    	$scope.rcliente = {};
    };

    this.setPatientDetail = function(){
        var sPatient = createCtrl.patient;
        Patients.get({ patientId: sPatient }, function(patientResult){
		$scope.rpaciente.FullName = patientResult.patientFirstName + ' ' + patientResult.patientLastName;
		$scope.rpaciente._id = patientResult._id;
		$scope.rpaciente.ID = patientResult.patientId;
		$scope.rpaciente.telefono = patientResult.patientTelefono;
		$scope.rpaciente.polisa = patientResult.patientPolisa;
		$scope.rpaciente.age = patientResult.patientEdad;
		Cliente.get({ clienteId: patientResult.clientes }, function(clienteResult){
		$scope.rpaciente.aseguradora = clienteResult.name;
	    });
	    });
    };

     $scope.setDoctorDetail = function(doctorparamId){
        var sDoctor = doctorparamId;
        Doctors.get({ doctorId: createCtrl.doctors }, function(doctorResult){
          $scope.doctorName = doctorResult.firstName + ' ' + doctorResult.lastName;
		  $scope.rdoctor.ID = doctorResult.DoctorId;
		  $scope.rdoctor._id = doctorResult._id;
		  $scope.rdoctor.telefono = doctorResult.DoctorTelefono;
	    });
    };

     $scope.setProcsDetail = function(){
	    var sProcs = createCtrl.procs;
         console.log(sProcs);
         var nserie = '';
         Procs.get({ procsId: sProcs }, function(procsResult){
		 $scope.rprocs = procsResult;
         $scope.presultType = $scope.rprocs.proType;
         console.log($scope.rprocs);
          if($scope.presultType === 'C'){
          	$scope.presultType = 'P';
          }

	      var currentB = CierreControl.getActiveCurrentMonth($scope.presultType);
	      currentB.then(function(r){

	       $scope.currentB = r[0];
	       console.log($scope.currentB);
	       if($scope.currentB) {
          	 console.log($scope.rprocs.proType);
          	   if($scope.rprocs.proType === 'B'){         	   
          	   	 if($scope.flag === true){
          	   	 	console.log($scope.BcounterIncrement);    
		         	  $scope.nserie = $scope.currentB.month + $scope.rprocs.proType  + $scope.currentB.year + '-' + (parseInt($scope.currentB.counter) + parseInt($scope.BcounterIncrement) + 1);
		         	  $scope.Bcounter = $scope.currentB.counter + $scope.BcounterIncrement;

		         	}else{   	  	 
		         	 $scope.currentCount = parseInt($scope.currentB.counter);
		         	 $scope.Bcounter = $scope.currentCount + 1;		                	
		         	 $scope.nserie = $scope.currentB.month + $scope.rprocs.proType  + $scope.currentB.year + '-' + $scope.Bcounter;
		          
		             }
          	   } else if ($scope.rprocs.proType === 'BL') {
                    if($scope.BLflag === true){
		         	  $scope.nserie = $scope.rprocs.proType  + $scope.currentB.year + '-' + (parseInt($scope.currentB.counter) + parseInt($scope.BLcounterIncrement) + 1);
		         	  $scope.BLcounter = $scope.currentB.counter + $scope.BLcounterIncrement;
		         	
		         	}else{
		         	 $scope.blcurrentCount = parseInt($scope.currentB.counter);
		         	 $scope.BLcounter = $scope.blcurrentCount + 1;         	
		         	 $scope.nserie =    $scope.rprocs.proType  + $scope.currentB.year + '-' + $scope.BLcounter;
		            }

		       } else {     	   
		       	   if($scope.Pflag === true){
		         	$scope.nserie = $scope.presultType + $scope.currentB.year + '-' + (parseInt($scope.currentB.counter) + parseInt($scope.PcounterIncrement) + 1);
		         	$scope.Pcounter = $scope.currentB.counter + $scope.PcounterIncrement;
		         	}else{
		         	$scope.pcurrentCount = parseInt($scope.currentB.counter);
		         	$scope.Pcounter = $scope.pcurrentCount + 1;
		         	$scope.nserie =  $scope.presultType  + $scope.currentB.year + '-' + $scope.Pcounter;

		              } 
		       }        
		           $scope.rprocs.ID = $scope.nserie;
		   }   
	      });
	      $scope.p = $scope.currentB;
	    });
    };
    
     $scope.clearPatientForm = function(){
    	createCtrl.paciente = Patients.get();
    	$scope.rpaciente = {};
    };

    $scope.clearDoctorForm = function(){
    	createCtrl.doctor = Doctors.get();
    	$scope.rdoctor = {};
    };

    $scope.clearProcForm = function(){	
    	$scope.rprocs = {};
    	$scope.procedimeinto =  Procs.get();
    };

    $scope.getTotal = function(){
          $scope.total = 0;
          for(var i = 0; i < $scope.orderDetail.length; i++ ){
          	$scope.orderd = $scope.orderDetail[i];
          	$scope.total += Number($scope.orderd.costo ? $scope.orderd.costo : 0 );
          } 
          return $scope.total;   	
    };

   this.deleteProcs = function(index) { 
     $scope.orderDetail.splice(index, 1);
     $scope.BcounterIncrement -= 1;
     $scope.doSearch();
   };

   $scope.clearOrderForm =  function(){
     	 $scope.orderDetail = [];
     	 $scope.doSearch();
     	 $scope.note = "";
     	 $scope.duedate = "";
     	 $scope.autorisation = "";
     	 $scope.statusOrder = "";

   };

   $scope.showSimpleUdpdate = function() {
	    $mdToast.show(
		$mdToast.simple()
	    .content('Folio Guardado Exitosamente!!')
	    .position('top right')
	    .hideDelay(4000)
		);
   };

   $scope.cleanForm = function(){
          $scope.clearDoctorForm();
	      $scope.clearPatientForm();
	      $scope.clearClientForm();
	      //$scope.clearClientForm();
	      $scope.clearOrderForm();
	      $scope.showSimpleUdpdate();
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
		      controller: 
		      //'modalDelete',
		      function ($scope, $modalInstance) {
                  $scope.ok = function () {  
                  console.log('works');                 
                  $scope.cleanForm();
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


    // Create new Pai
 	this.create = function() {
 		$scope.isSaving = true;
            var patientClient = false;
            if(createCtrl.clientes === ''){
            	patientClient = true;
            }
 	        var orders = new Orders({
               clienteName : $scope.rcliente.name,
               clienteId: $scope.rcliente.ID,
               clienteIc: $scope.rcliente.IC,
               proclist: $scope.orderDetail,
               nota: $scope.note,
               total: $scope.total ,
               statusOrder : $scope.statusOrder,
               fechaValida: $scope.duedate,
               patientName: $scope.rpaciente.FullName,
               patientId: $scope.rpaciente.ID,
               patientsClient : patientClient,
               patientEdad: $scope.rpaciente.age,
               doctorName : $scope.doctorName,
               doctorId: $scope.rdoctor.ID,
               cliente: $scope.rcliente._id,
               doctor: $scope.rdoctor._id,
               patients: $scope.rpaciente._id
 	      });
        $scope.orderResult = orders;
        console.log($scope.orderResult);   

        var d = new Date();
	    var y = d.getFullYear();
		var m = d.getMonth();
		var year = y.toString();
        
        if($scope.Bcounter){
			  var info = {
			    	year: $scope.p.year,
			    	month: $scope.p.month,
			    	proType: 'B',
			    	newCount: $scope.Bcounter
		       };
        
        $http.post('/api/count', {info: info})
        .success(function(){
        	$scope.BcounterIncrement = 0;
        }).error(function(err){
		     	console.log(err);
		 });
	   }

	    if($scope.Pcounter){
			var info = {
			    	year: $scope.p.year,
			    	month: $scope.p.month,
			    	proType: 'P',
			    	newCount: $scope.Pcounter 
		       };
        $http.post('/api/count', {info: info})
        .success(function(){
        	$scope.PcounterIncrement = 0;
        }).error(function(err){
		     	console.log(err);
		 });
	   }

	    if($scope.BLcounter){
			    var info = {
			    	year: $scope.p.year,
			    	month: $scope.p.month,
			    	proType: 'BL',
			    	newCount: $scope.BLcounter 
		       };
        $http.post('/api/count', {info: info})
        .success(function(){
        	$scope.BLcounterIncrement = 0;
        }).error(function(err){
		     	console.log(err);
		 });
	   }
 	   
 	      orders.$save(function(response){
	      Notify.sendMsg('newPis', {'id': 'nada'});
	      $scope.orderResponse = response;
         for(var i = 0; i < $scope.orderResponse.proclist.length; i++ ){
          var report = new Result({
	          rSereal: $scope.orderResponse.proclist[i].id,
	          tipomuestra : $scope.orderResponse.proclist[i].procType,
	          tipomuestraDesc: $scope.orderResponse.proclist[i].name,
	          reportStatus: 'Pendiente',
	          orders: $scope.orderResponse._id
           }); 

         report.$save(function(response){
         	 $timeout(function(){
	         	 $scope.isSaving = false;
	         	 $scope.testThis();
	         	 alertify.success('Acción realizada exitosamente!! !!');
         	 }, 2000);
          }, function(errorResponse){
	       // En otro caso, presentar al usuario el mensaje de error
	        alertify.error('Se ha producido un error en el sistema!!');
           
	      });
         }
         
	    }, function(errorResponse) {
	       alertify.error('Se ha producido un error en el sistema!!');
	   });
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
     link: function(scope, element, attr){          // when a new cliente is added update the cliente List..

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
     link: function(scope, element, attr){          // when a new cliente is added update the cliente List..

            Notify.getMsg('newPis', function(event, data){                 	
         });
    }
   };
 }]);
