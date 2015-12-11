'use strict';

(function() {
	// Maintains Controller Spec
	describe('Maintains Controller Tests', function() {
		// Initialize global variables
		var MaintainsController,
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

			// Initialize the Maintains controller.
			MaintainsController = $controller('MaintainsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Maintain object fetched from XHR', inject(function(Maintains) {
			// Create sample Maintain using the Maintains service
			var sampleMaintain = new Maintains({
				name: 'New Maintain'
			});

			// Create a sample Maintains array that includes the new Maintain
			var sampleMaintains = [sampleMaintain];

			// Set GET response
			$httpBackend.expectGET('maintains').respond(sampleMaintains);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.maintains).toEqualData(sampleMaintains);
		}));

		it('$scope.findOne() should create an array with one Maintain object fetched from XHR using a maintainId URL parameter', inject(function(Maintains) {
			// Define a sample Maintain object
			var sampleMaintain = new Maintains({
				name: 'New Maintain'
			});

			// Set the URL parameter
			$stateParams.maintainId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/maintains\/([0-9a-fA-F]{24})$/).respond(sampleMaintain);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.maintain).toEqualData(sampleMaintain);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Maintains) {
			// Create a sample Maintain object
			var sampleMaintainPostData = new Maintains({
				name: 'New Maintain'
			});

			// Create a sample Maintain response
			var sampleMaintainResponse = new Maintains({
				_id: '525cf20451979dea2c000001',
				name: 'New Maintain'
			});

			// Fixture mock form input values
			scope.name = 'New Maintain';

			// Set POST response
			$httpBackend.expectPOST('maintains', sampleMaintainPostData).respond(sampleMaintainResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Maintain was created
			expect($location.path()).toBe('/maintains/' + sampleMaintainResponse._id);
		}));

		it('$scope.update() should update a valid Maintain', inject(function(Maintains) {
			// Define a sample Maintain put data
			var sampleMaintainPutData = new Maintains({
				_id: '525cf20451979dea2c000001',
				name: 'New Maintain'
			});

			// Mock Maintain in scope
			scope.maintain = sampleMaintainPutData;

			// Set PUT response
			$httpBackend.expectPUT(/maintains\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/maintains/' + sampleMaintainPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid maintainId and remove the Maintain from the scope', inject(function(Maintains) {
			// Create new Maintain object
			var sampleMaintain = new Maintains({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Maintains array and include the Maintain
			scope.maintains = [sampleMaintain];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/maintains\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMaintain);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.maintains.length).toBe(0);
		}));
	});
}());