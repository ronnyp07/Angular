/*jshint strict:false */
'Use strict';

var doctorModule = angular.module('doctor');

doctorModule.controller
('doctorsController', 
['$scope', 
 '$http', 
 '$routeParams', 
 '$location',
 'Doctors',  
 'Authentication', 
 'ngTableParams',
 '$modal', 
  '$log',
 'Pais',
 'Ciudad',
 'Sector',
 'Cliente',
 'NotifyPatient',
 function($scope, $http, $routeParams, $location, Doctors, Authentication, ngTableParams, $modal, $log,
  //Seguros, 
  Pais, Ciudad, Sector, Cliente,  NotifyPatient) {
      
      // var patient = Patients.query()
       var params = {
          page: 1,            
          count: 15,
          filter: {             
              name: name,
              clinica: ''
        }
       };

       var settings = {
         total: 0,  
         counts: [15,20,25],        
         getData: function($defer, params) {
         Doctors.get(params.url(), function(response){     
                params.total(response.total);
                $defer.resolve(response.results);

              for (var i = 0; i < response.results.length; i++) {
                response.results[i].clinica = ''; //initialization of new property 
                response.results[i].clinica = response.results[i].clinicaList.length > 0 ? response.results[i].clinicaList[0].clinica : '';  //set the data from nested obj into new property
              }
                $scope.total = response.total;
          });
       }
    };

    $scope.calculateAge = function calculateAge(birthday) { 
    // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    };

    /* jshint ignore:start */
    $scope.tableParams = new ngTableParams( params, settings);
    /* jshint ignore:end */

    
    //Open the middleware to open a single cliente modal.
     this.modelRemove =  function (size, selected) {
        $scope.doctor = selected;
        var modalInstance = $modal.open({
          templateUrl: 'doctors/views/doctor-delete.template.html',
          controller: ['$scope', '$modalInstance', 'doctor', function ($scope, $modalInstance, doctor) {
                 $scope.doctor = doctor;
                 $scope.ok = function () {
                   //console.log($scope.cliente);
                  // $scope.doSearch();
                  $modalInstance.close($scope.doctor);
          };
          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };
          }],

          size: size,
          resolve: {
            doctor: function () {
              return selected;
            }
          }
     });

   modalInstance.result.then(function (selected) {
      $scope.selected = selected;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

        //Open the middleware to open a single pais modal.
   this.modelUpdate = function (size, selectedDoctor) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'doctors/views/edit-doctor.client.view.html',
          controller: ['$scope', '$modalInstance', 'doctor', function ($scope, $modalInstance, doctor) {
            $scope.doctor = doctor;
            $scope.doctor.rClinicaList = selectedDoctor.clinicaList;
            $scope.doctor.rpais = selectedDoctor.pais;
            $scope.doctor.rciudad = selectedDoctor.ciudad;
            $scope.doctor.rsector = selectedDoctor.sector;
            $scope.ok = function () {  
                $modalInstance.close($scope.doctor);
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };

          }],
          size: size,
          resolve: {
            doctor: function () {
              return selectedDoctor;
            }
          }
     });

   modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    this.modelCreate = function (size, createdDoctor) {
        var modalInstance = $modal.open({
          templateUrl: 'doctors/views/create-doctor.client.view.html',
          controller: ['$scope', '$modalInstance', 'doctor', function ($scope, $modalInstance, doctor) {
            $scope.ok = function () {  
                $modalInstance.close($scope.doctor);
            };
            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }],

          size: size,
          resolve: {
              doctor: function () {
              return createdDoctor;
            }
          }
     });

     modalInstance.result.then(function (selectedItem) {
      $scope.createdDoctor = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    $scope.doSearch = function(){
        $scope.tableParams.reload();
    };  

     NotifyPatient.getMsg('doctorsaved', function(event, doctor){
       $scope.doSearch();
     });
 }
]);

doctorModule.controller
  ('doctorCreateController', 
  ['$scope', 
   '$http', 
   '$routeParams',  
   'Authentication', 
   'DoctorsService',
   'Doctors',
   'Pais',
   'Ciudad',
   'Sector',
   'Cliente',
   'Notify', 
   '$mdToast', 
   '$animate', 
   'NotifyPatient',
   '$modal',
   function(
    $scope, 
    $http, 
    $routeParams,  
    Authentication, 
    DoctorsService,
    Doctors, 
    Pais, 
    Ciudad, 
    Sector, 
    Cliente, 
    Notify, 
    $mdToast, 
    $animate, 
    NotifyPatient,
    $modal){

     var vm = this;
     $scope.doctorServices = DoctorsService;
     vm.ClinicaList = [];
     vm.pais = Pais.query();
     vm.ciudad = Ciudad.query();
     vm.sector = Sector.query();
     loadClientes();

    Notify.getMsg('clinicaLoad', function(event, data){ 
      console.log('resive');
      loadClientes();
    });

   

    vm.AddClinica = function(){
       var skillsSelect = document.getElementById('clinicaDoctor');
       var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
      if(vm.ClinicaList.length <= 0) {
         vm.ClinicaList.push({id: this.clientes, clinica: selectedText});
       }else{
        for(var i = 0; i< vm.ClinicaList.length; i++){
          if(vm.ClinicaList[i].id === this.clientes){
              alertify.error('Esta clinica ya esta asociada');
            return;
          }
        }

        vm.ClinicaList.push({id: vm.clientes, clinica: selectedText});
       }
   };

    function loadClientes(){
     $http.post('cliente/getList').
          success(function(data){ 
           vm.cliente = data;
           }).
           error(function(err){
     });
    }

    vm.deleteClinica = function($index){
     // console.log($index);
        vm.ClinicaList.splice($index, 1);
     };

    vm.filterByPais = function(){
      this.sector = {};      
    };

    vm.filterByCiudad = function(){
      this.sector = Sector.query();
    };

    vm.DoctorCI = {};
    $scope.authentication = Authentication;
    $scope.referred = true;

    vm.showPatientSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

   vm.create = function(param){
    $scope.doctorServices.checkDoctor(param).then(function(create){
      if(create === true){
         alertify.error('Doctor ya existe!!');
      }else{
        $scope.ok();
      var DoctorCI = {
        tipo: vm.DoctorCI ? vm.DoctorCI.tipo : '' , 
        value: vm.DoctorCI ? vm.DoctorCI.value : '' 
        };
      var doctor = new Doctors({
      DoctorCI: DoctorCI,
      firstName: vm.firstName,
      lastName: vm.lastName,
      DoctorTelefono : vm.DoctorTelefono,
      DoctorTelefonoOff: vm.DoctorTelefonoOff,
      DoctorSexo : vm.DoctorSexo,
      DoctorEmail: vm.DoctorEmail,
      DoctorDireccion: vm.DoctorDireccion,   
      pais: vm.doctorPais,
      ciudad: vm.doctorCiudad,
      sector: vm.doctorSector,
      clinicaList : vm.ClinicaList
      });
      // Usar el método '$save' de Patient para enviar una petición POST apropiada
      doctor.$save(function(response){ 
      NotifyPatient.sendMsg('doctorsaved', {doctorSavedInfo: response});
      

      }, function(errorResponse) {
       // En otro caso, presentar al usuario el mensaje de error
       $scope.error = errorResponse.data.message;
       console.log($scope.error);
       });
      }


    });
    };
    }
]);

doctorModule.controller
  ('doctorUpdateController', 
  ['$scope', 
   '$http', 
   '$routeParams',  
   'Authentication', 
   'Doctors', 
   //'Seguros',
   'OrderServices',
   'Pais',
   'Ciudad',
   'Sector',
   'Cliente',
   'NotifyPatient', '$mdToast', '$animate', 'ClienteService',
   function($scope, $http, $routeParams,  Authentication, Doctors, OrderServices, 
    Pais, Ciudad, Sector, Cliente,  NotifyPatient, $mdToast, $animate, ClienteService) {
     
     var vm = this;
     $scope.OrderServices = OrderServices;
     this.pais = Pais.query();
     this.ciudad = Ciudad.query();
     this.sector = Sector.query();
     //this.cliente = ClienteService;
     this.ClientList = [];

     $http.post('cliente/getList').
          success(function(data){ 
           vm.cliente = data;
           console.log(vm.cliente);
           }).
           error(function(err){
     });
     
     this.AddClinica = function(){
       var skillsSelect = document.getElementById('clinicaDoctor');
       var selectedText = skillsSelect.options[skillsSelect.selectedIndex].text;
       if($scope.doctor.rClinicaList.length <= 0){
       $scope.doctor.rClinicaList.push({id: this.clientes, clinica: selectedText});
       }else{
        for(var i = 0; i< $scope.doctor.rClinicaList.length; i++){
          if($scope.doctor.rClinicaList[i].id === this.clientes){
              alertify.error('Esta clinica ya esta asociada');
            return;
          }
        }
        $scope.doctor.rClinicaList.push({id: this.clientes, clinica: selectedText});
       }
     };

     this.deleteClinica = function($index){
      console.log($index);
        $scope.doctor.rClinicaList.splice($index, 1);
     };

     this.filterByPais = function(){
            this.sector = {}; 
     };

     this.filterByCiudad = function(){
      this.sector = Sector.query();
     };

    this.showDoctorSave = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Nuevo Paciente Guardado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };

    this.update = function(selectedDoctor){
    if(selectedDoctor.DoctorCI){
        this.DoctorCI = {
          tipo: selectedDoctor.DoctorCI.tipo, 
          value: selectedDoctor.DoctorCI.value 
        };
      }
     
    // Usar los campos form para crear un nuevo objeto $resource Patient
      var doctors = new Doctors({
      _id: selectedDoctor._id,
      DoctorCI : this.DoctorCI,
      firstName: selectedDoctor.firstName,
      lastName: selectedDoctor.lastName,
      DoctorEmail : selectedDoctor.DoctorEmail,
      DoctorTelefono: selectedDoctor.DoctorTelefono,
      DoctorTelefonoOff: selectedDoctor.DoctorTelefonoOff,
      DoctorSexo : this.DoctorSexo,
      DoctorDireccion: selectedDoctor.DoctorDireccion,
      pais: $scope.doctor.rpais,
      ciudad: $scope.doctor.rciudad,
      sector: $scope.doctor.rsector,
      clinicaList : $scope.doctor.rClinicaList
      });

     // Usar el método '$save' de Patient para enviar una petición POST apropiada
      doctors.$update(function(data){ 
         if($scope.OrderServices.selectedDoctor){
             if($scope.OrderServices.selectedDoctor._id === data._id){
                $scope.OrderServices.setDoctorDetail($scope.OrderServices.selectedDoctor._id);
             }
         }
      }, function(errorResponse) {
       $scope.error = errorResponse.data.message;
       });
    };
    }
]);

doctorModule.controller('doctorDeleteController', ['$scope', 'Authentication', 'Doctors', 'Notify', '$mdToast', '$animate', 'NotifyPatient',
  function($scope, Authentication, Doctors, Notify, $mdToast, $animate, NotifyPatient) {
    $scope.authentication = Authentication;
        this.delete = function(patient) {
          //console.log ('passed');
         var doctor = new Doctors({
                _id: $scope.doctor._id
         });

         doctor.$remove(function(){
          NotifyPatient.sendMsg('doctorsaved', {doctorSavedInfo:''});
         }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
       });

     };

     this.showSimpleToast = function() {
      $mdToast.show(
        $mdToast.simple()
          .content('Doctor Eliminado!!')
          .position('bottom right')
          .hideDelay(3000)
      );
    };
      
  }
]);


doctorModule.directive('doctorsList', ['Patients', 'Notify', function(Cliente, Notify){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'doctors/views/doctor-list.template.html',
     link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
            Notify.getMsg('newPis', function(event, data){
                scope.doctorsCtrl.doSearch(); 
         });
    }
   };
 }]);

doctorModule.directive('doctorsContact', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'doctors/template/doctor-contact-template.html'
    };
 });

doctorModule.directive('doctorsClinica', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'doctors/template/doctor-clinica-template.html'
    };
 });

doctorModule.directive('doctorscreateContact', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'doctors/template/doctorcreate-contact-template.html'
    };
 });

doctorModule.directive('doctorscreateClinica', function(){
    return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'doctors/template/doctorcreate-clinica-template.html'
    };
 });