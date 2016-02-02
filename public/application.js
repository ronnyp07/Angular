'use strinct';

var mainApplicationModuleName = 'mean';

var mainApplicationModule = angular.module('mean', 
	[
	 'ngResource', 
	 'ui.router',
	 'ngRoute',
	 'users', 
	 'example', 
	 'patients', 
	 'pais',
	 'sector',
	 'ciudad',
	 'ui.select2',
	 'ui.bootstrap',
	 'ngTable',
	 'clientes',
	 'tempresult',
	 'procs',
	 'ngLodash',
	 'doctor',
	 'orders', 
	 'cierre',
	 'index',
	 'headermasters',
	 'maintains',
	 'locations',
	 'ngMaterial',
	 'ui.date',
	 'angularUtils.directives.dirPagination',
	 'daterangepicker',
	 'ui.calendar',
	 'ngLodash']);

mainApplicationModule.config(['$locationProvider',
 function($locationProvider){
	$locationProvider.hashPrefix('!');
	

}
]);

angular.element(document).ready(function(){
    angular.bootstrap(document, [mainApplicationModuleName]);
});