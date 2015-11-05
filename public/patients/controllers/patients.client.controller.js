'use strict';

var patientModule = angular.module('patients');

patientModule.controller
('pacientsController', 
['$scope', 
 '$http', 
 '$routeParams', 
 '$location',  
 'Authentication', 
 'Patients', 
 //'Seguros',
 'ngTableParams',
 '$modal', 
  '$log',
 'Pais',
 'Ciudad',
 'Sector',
 'Cliente',
 'NotifyPatient',
 '$timeout',
 function($scope, $http, $routeParams, $location,  Authentication, Patients, ngTableParams, $modal, $log,
  //Seguros, 
  Pais, Ciudad, Sector, Cliente, NotifyPatient, $timeout) {
      $scope.isSaving = false;

      // var patient = Patients.query()
       var params = {
          page: 1,            
          count: 15,
          filter: {
              name: name
        }
       }

       var settings = {
      //  groupBy: 'tipo',
         total: 0,  
         counts: [15,20,25],        
         getData: function($defer, params) {
         Patients.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);
                $scope.total = response.total;
               // console.log(response);
          }); 
        
          }
       };

      $scope.tableParams = new ngTableParams( params, settings);

      NotifyPatient.getMsg('updating', function(event, data){
         $scope.isSaving = true;
      });

       NotifyPatient.getMsg('updated', function(event, data){
         $scope.isSaving = false;
         alertify.success('Acción realizada exitosamente!! !!'); 
      });
    //Open the middleware to open a single cliente modal.
     this.modelRemove = function (size, selectedcliente) {
          $scope.patient = selectedcliente;
        var modalInstance = $modal.open({
          templateUrl: 'patients/views/patient-delete.template.html',
          controller: 
          //'modalDelete',
          function ($scope, $modalInstance, patient) {
                 $scope.patient = patient;
                  
                  $scope.ok = function () {
                   //console.log($scope.cliente);
                  // $scope.doSearch();
                  $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            patient: function () {
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

        //Open the middleware to open a single pais modal.
   this.modelUpdate = function (size, selectedPatient) {
        var modalInstance = $modal.open({
          templateUrl: 'patients/views/edit-patient.client.view.html',
          controller: function ($scope, $modalInstance, patient) {
                $scope.patient = patient;
                $scope.patient.rpais = selectedPatient.pais ? selectedPatient.pais._id : '';
                $scope.patient.rciudad = selectedPatient.ciudad ? selectedPatient.ciudad._id: '';
                $scope.patient.rsector = selectedPatient.sector ? selectedPatient.sector._id: '';
                $scope.patient.rcliente = selectedPatient.clientes ? selectedPatient.clientes._id: '';

          $scope.ok = function () {  
              $modalInstance.close($scope.patient);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
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


    this.modelCreate = function (size) {
        var modalInstance = $modal.open({
          templateUrl: 'patients/views/create-patient.client.view.html',
          controller: 'modalResutl',
          size: size
     });

     modalInstance.result.then(function (selectedItem) {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    this.doSearch = function () {
        $scope.tableParams.reload();
    };  

 }

]);

patientModule.controller
  ('PatientsCreateController', 
  ['$scope', 
   '$http', 
   '$routeParams',  
   'Authentication', 
   'Patients', 
   //'Seguros',
   'Pais',
   'Ciudad',
   'Sector',
   'Cliente',
   'NotifyPatient', '$mdToast', '$animate',
   function($scope, $http, $routeParams,  Authentication, Patients, 
    Pais, Ciudad, Sector, Cliente, NotifyPatient, $mdToast, $animate) {

    this.paisD = Pais.query();
    this.ciudad = Ciudad.query();
    this.sector = Sector.query();
    this.cliente = Cliente.get();

    console.log(this.ciudad);
    
    this.filterByCity = function() {
        if(this.pais == null){
          console.log('pais is null');
           this.ciudad = null;
           this.sector = null;
           this.patientSector = null;
        }else{
         console.log(this.pais);
         this.ciudad = Ciudad.query();
         this.sector = null;
         this.patientSector = null;
      }
    };

    this.filterSector = function(){
      if(this.pais === null ||  this.ciudad === null){
         this.sector = null;
      }else {
      this.sector = Sector.query();
       }
    };

    this.calculateAge = function () {
      console.log('crete');
    // birthday is a date
    // var ageDifMs = Date.now() - birthday.getTime();
    // var ageDate = new Date(ageDifMs); // miliseconds from epoch
    // console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
    //return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    this.PatientCI = {};
    $scope.authentication = Authentication;
    $scope.referred = true;
    //$scope.seguros = Seguros.query();

    this.showPatientSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

    this.create = function(){
    this.PatientCI = {
      tipo: this.PatientCI.tipo, 
      value: this.PatientCI.tipovalue 
    }
    //console.log(this.PatientCI);
    // Usar los campos form para crear un nuevo objeto $resource Patient
     
      // this.dateFormat = ''

      // if(this.patientDOB){
      // var parts = this.patientDOB.split("-");
      // this.dateFormat = new Date(parseInt(parts[2], 10),
      //                   parseInt(parts[1], 10) - 1,
      //                   parseInt(parts[0], 10));
      // }

      var patient = new Patients({
      PatientCI: this.PatientCI,
      patientFirstName: this.patientFirstName,
      patientLastName: this.patientLastName,
      patientDOB : this.patientDOB,
      patientEdad: this.patientEdad,
      patientSexo: this.patientSexo,
      patientEC : this.patientEC,
      patientTelefono: this.patientTelefono,
      clientes: this.clientes,
      patientPolisa: this.patientPolisa,
      patientDireccion: this.patientDireccion,
      pais: this.pais,
      ciudad: this.patientCiudad,
      sector: this.patientSector

      });

      console.log(patient);
      //
      // Usar el método '$save' de Patient para enviar una petición POST apropiada
      patient.$save(function(response){ 
     NotifyPatient.sendMsg('saved', {'id': 'nada'});

       // Limpia los fields del formulario        
      // this.PatientCI = {};
       // this.patientFirstName = '';
       // this.patientLastName = '';
       // this.patientDOB = '';
       // this.patientEdad = '';
       // this.patientSexo = '';
       // this.patientEC = '';
       // this.patientTelefono = '';
       // this.parientSeguro = '';
       // this.patientPolisa = '';
       // this.patientDireccion = '';
       // this.patientPais = '';
       // this.patientCiudad = '';
       // this.patientSector = '';
       // this.dateFormat = '';

      }, function(errorResponse) {
       // En otro caso, presentar al usuario el mensaje de error
       $scope.error = errorResponse.data.message
       });
    };
    }
]);



patientModule.controller
  ('PatientsUpdateController', 
  ['$scope', 
   '$http', 
   '$routeParams',  
   'Authentication', 
   'Patients', 
   //'Seguros',
   'Pais',
   'Ciudad',
   'Sector',
   'Cliente',
   'NotifyPatient', '$mdToast', '$animate','$timeout',
   function($scope, $http, $routeParams,  Authentication, Patients, 
    Pais, Ciudad, Sector, Cliente, NotifyPatient, $mdToast, $animate, $timeout) {



    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
    };

     this.pais = Pais.query();
     this.ciudad = Ciudad.query();
     this.sector = Sector.query();
     this.cliente = Cliente.get();
     
    console.log(this.ciudad);  
   
   this.filterByCity = function() {
        if(this.pais == null){
          console.log('pais is null');
           this.ciudad = null;
           this.sector = null;
           this.patientSector = null;
        }else{
         console.log(this.pais);
         this.ciudad = Ciudad.query();
         this.sector = null;
         this.patientSector = null;
      }
    };

    this.filterSector = function(){
      if(this.pais === null ||  this.ciudad === null){
         this.sector = null;
      }else {
      this.sector = Sector.query();
       }
    };
    
    this.filterByCiudad = function(){
      this.sector = Sector.query();
     };

     
    this.showPatientSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

    this.update = function(selectedPatient){
    NotifyPatient.sendMsg('updating', {'id': 'nada'});
    this.PatientCI = {
      tipo: selectedPatient.PatientCI ? selectedPatient.PatientCI.tipo: '', 
      value: selectedPatient.PatientCI ? selectedPatient.PatientCI.value: '' 
    }

    console.log(selectedPatient.rciudad);
    // Usar los campos form para crear un nuevo objeto $resource Patient
      var patient = new Patients({
      _id: selectedPatient._id,
      PatientCI : this.PatientCI,
      patientFirstName: selectedPatient.patientFirstName,
      patientLastName: selectedPatient.patientLastName,
      patientDOB : selectedPatient.patientDOB,
      patientEdad: selectedPatient.patientEdad,
      patientSexo: selectedPatient.patientSexo,
      patientEC : selectedPatient.patientEC,
      patientTelefono: selectedPatient.patientTelefono,
      clientes: $scope.patient.rcliente,
      patientPolisa: selectedPatient.patientPolisa,
      patientDireccion: selectedPatient.patientDireccion,
      pais: $scope.patient.rpais,
      ciudad: selectedPatient.rciudad,
      sector: selectedPatient.rsector

      });
      console.log(patient);
     // Usar el método '$save' de Patient para enviar una petición POST apropiada
      patient.$update(function(){ 
           $timeout(function() {
             NotifyPatient.sendMsg('updated', {'id': 'nada'});
           }, 3000);      
       
      }, function(errorResponse) {
       $scope.error = errorResponse.data.message
       });
    };
    }
]);

patientModule.controller('patientDeleteController', ['$scope', 'Authentication', 'Patients', 'NotifyPatient', '$mdToast', '$animate',
  function($scope, Authentication, Patients, NotifyPatient, $mdToast, $animate) {
    $scope.authentication = Authentication;
      // Update existing Pai
        
        this.delete = function(patient) {
          //console.log ('passed');
         var patient = new Patients({
                _id: $scope.patient._id
         });

         console.log($scope.patient);

         patient.$remove(function(){
          NotifyPatient.sendMsg('removed', {'id': 'nada'});
         }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
       });

     };

     this.showSimpleToast = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Paciente Eliminado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };
      
  }
]);


patientModule.directive('patientList', ['Patients', 'NotifyPatient', function(Cliente, NotifyPatient){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'patients/views/patients-list.template.html',
     link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
            NotifyPatient.getMsg('newPis', function(event, data){
                scope.pacientsCtrl.doSearch(); 
         });
    }
   };
 }]);