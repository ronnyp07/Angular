'use strict';

(function() {
	// Headermasters Controller Spec
	describe('Headermasters Controller Tests', function() {
		// Initialize global variables
		var HeadermastersController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Headermasters controller.
			HeadermastersController = $controller('HeadermastersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Headermaster object fetched from XHR', inject(function(Headermasters) {
			// Create sample Headermaster using the Headermasters service
			var sampleHeadermaster = new Headermasters({
				name: 'New Headermaster'
			});

			// Create a sample Headermasters array that includes the new Headermaster
			var sampleHeadermasters = [sampleHeadermaster];

			// Set GET response
			$httpBackend.expectGET('headermasters').respond(sampleHeadermasters);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.headermasters).toEqualData(sampleHeadermasters);
		}));

		it('$scope.findOne() should create an array with one Headermaster object fetched from XHR using a headermasterId URL parameter', inject(function(Headermasters) {
			// Define a sample Headermaster object
			var sampleHeadermaster = new Headermasters({
				name: 'New Headermaster'
			});

			// Set the URL parameter
			$stateParams.headermasterId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/headermasters\/([0-9a-fA-F]{24})$/).respond(sampleHeadermaster);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.headermaster).toEqualData(sampleHeadermaster);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Headermasters) {
			// Create a sample Headermaster object
			var sampleHeadermasterPostData = new Headermasters({
				name: 'New Headermaster'
			});

			// Create a sample Headermaster response
			var sampleHeadermasterResponse = new Headermasters({
				_id: '525cf20451979dea2c000001',
				name: 'New Headermaster'
			});

			// Fixture mock form input values
			scope.name = 'New Headermaster';

			// Set POST response
			$httpBackend.expectPOST('headermasters', sampleHeadermasterPostData).respond(sampleHeadermasterResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Headermaster was created
			expect($location.path()).toBe('/headermasters/' + sampleHeadermasterResponse._id);
		}));

		it('$scope.update() should update a valid Headermaster', inject(function(Headermasters) {
			// Define a sample Headermaster put data
			var sampleHeadermasterPutData = new Headermasters({
				_id: '525cf20451979dea2c000001',
				name: 'New Headermaster'
			});

			// Mock Headermaster in scope
			scope.headermaster = sampleHeadermasterPutData;

			// Set PUT response
			$httpBackend.expectPUT(/headermasters\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/headermasters/' + sampleHeadermasterPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid headermasterId and remove the Headermaster from the scope', inject(function(Headermasters) {
			// Create new Headermaster object
			var sampleHeadermaster = new Headermasters({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Headermasters array and include the Headermaster
			scope.headermasters = [sampleHeadermaster];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/headermasters\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHeadermaster);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.headermasters.length).toBe(0);
		}));
	});
}());