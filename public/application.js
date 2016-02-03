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
	 'angular-ladda',
	 'ngLodash']);

mainApplicationModule.config(['$locationProvider', 'laddaProvider',
 function($locationProvider, laddaProvider){
	$locationProvider.hashPrefix('!');

	laddaProvider.setOption({
		style: 'expand-right'
	});
}
]);

angular.element(document).ready(function(){
    angular.bootstrap(document, [mainApplicationModuleName]);
});