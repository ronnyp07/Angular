'use strict';

var indexModule = angular.module('index');

// cliente controller
indexModule.controller('indexController', ['$scope','$modal', function($scope, $modal){

 $scope.eventSources = [

        // your event source
        {
            events: [ // put the array in the `events` property
                {
                    title  : 'event1',
                    start  : '2015-07-09T12:30:00',
                    end:   '2015-07-09T13:45:00',
                    color: 'blue',
                    textColor: 'white' // an option!
                },
                {
                    title  : 'event2',
                    start  : '2015-07-07T06:00:00',
                    end: '2015-07-07T08:30:00',
                     color: 'blue',
                    textColor: 'white' 
                   
                },
                {
                    title  : 'event3',
                    start  : '2010-01-09T12:30:00',
                }
            ],
            //color: 'black',     // an option!
            //textColor: 'yellow' // an option!
        }

        // any other event sources...

    ]

       $scope.modelDetail = function (size, selectedPatient) {
       
       //console.log(selectedPatient);
        var modalInstance = $modal.open({
          templateUrl: 'index/partials/schedule.create.client.html',
          controller: function ($scope, $modalInstance, patient) {
           
	
          $scope.ok = function () {  
              $modalInstance.close();
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


	 $scope.alertEventOnClick = function(e){
	  	console.log('event clicked');
	  }
    
    $scope.openPopover= function(start, end, allDay, jsEvent){
	var m = moment(end.d);
	console.log(m.format('dddd'));
	console.log(moment.parseZone(end));
	console.log(moment(end).hour());
	console.log(moment(end).minute());

	 //$("#myPopover").popover('show');
    }

	 $scope.calOptions = {
      calendar:{
        height: 450,
        editable: true,
        selectable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        select: function(start, end, allDay, jsEvent) {
        $scope.modelDetail('lg', end);
        $scope.openPopover(start, end, allDay, jsEvent);
       },
       //dayClick: $scope.alertEventOnClick(),
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
  };



 



}]);