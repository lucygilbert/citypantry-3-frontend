describe('AdminMealPlanSetupMealPreferencesController', function() {
    'use strict';

    var scope;
    var $httpBackend;
    var makeCtrl;
    var NotificationService;
    var PackagesFactory;
    var MealPlanFactory;
    var CustomersFactory;
    var getCustomerMealPlanRequirementsPromise;
    var setCustomerMealPlanRequirementsPromise;
    var getPackageByHumanIdPromise;
    var rootScope;
    var $routeParams;

    beforeEach(function() {
        module('cp');
    });

    beforeEach(inject(function($controller, $rootScope, _NotificationService_, _PackagesFactory_,
            _MealPlanFactory_, _CustomersFactory_, _$httpBackend_, _$routeParams_) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        $httpBackend = _$httpBackend_;
        NotificationService = _NotificationService_;
        PackagesFactory = _PackagesFactory_;
        MealPlanFactory = _MealPlanFactory_;
        CustomersFactory = _CustomersFactory_;

        $routeParams = _$routeParams_;
        $routeParams.customerId = 'c123';

        makeCtrl = function () {
            $controller('AdminMealPlanSetupMealPreferencesController', {
                $scope: scope,
            });
        };

        spyOn(NotificationService, 'notifyError');
        spyOn(PackagesFactory, 'getEventTypes').and.returnValue(newPromise());
        spyOn(PackagesFactory, 'getCuisineTypes').and.returnValue(newPromise());
        spyOn(PackagesFactory, 'getDietaryTypes').and.returnValue(newPromise());
        spyOn(CustomersFactory, 'getCustomer').and.returnValue(newPromise());

        getCustomerMealPlanRequirementsPromise = newPromise();
        spyOn(MealPlanFactory, 'getCustomerMealPlanRequirements').and.returnValue(getCustomerMealPlanRequirementsPromise);

        spyOn(PackagesFactory, 'getPackageByHumanId').and.callThrough();

        setCustomerMealPlanRequirementsPromise = newPromise();
        spyOn(MealPlanFactory, 'setCustomerMealPlanRequirements').and.returnValue(setCustomerMealPlanRequirementsPromise);
    }));

    it('should load the customer and types information', function() {
        makeCtrl();

        expect(PackagesFactory.getEventTypes).toHaveBeenCalled();
        expect(PackagesFactory.getCuisineTypes).toHaveBeenCalled();
        expect(PackagesFactory.getDietaryTypes).toHaveBeenCalled();
        expect(NotificationService.notifyError).not.toHaveBeenCalled();
        expect(CustomersFactory.getCustomer).toHaveBeenCalled();
    });

    it('should convert the package dispositions object from the API to an array', function() {
        makeCtrl();

        getCustomerMealPlanRequirementsPromise.resolveSuccess({requirements: {
            packageDispositions: {
                'aaaa1111aaaa1111aaaa1111': 1,
                'bbbb2222bbbb2222bbbb2222': 2,
                'cccc3333cccc3333cccc3333': 2,
            },
        }});

        expect(scope.preferences.packageDispositionsArray).toEqual([
            {packageId: 'aaaa1111aaaa1111aaaa1111', disposition: 1},
            {packageId: 'bbbb2222bbbb2222bbbb2222', disposition: 2},
            {packageId: 'cccc3333cccc3333cccc3333', disposition: 2},
        ]);
    });

    it('should call getPackageByHumanId for each non-null package disposition', function() {
        scope.mealPlanSetupForm = {};
        scope.mealPlanSetupForm.$invalid = false;

        makeCtrl();

        scope.preferences.startDate = new Date();
        scope.preferences.packageDispositionsArray = [
            {packageId: 1, disposition: 1},
            {packageId: null, disposition: 2},
            {packageId: 4, disposition: null},
            // If the package ID is a string representation of a number, it should be treated as a number.
            {packageId: '2', disposition: 2},
            // The package ID can be a human ID or a Mongo ID.
            {packageId: 'aaaa1111aaaa1111aaaa1111', disposition: 1},
            {packageId: '', disposition: ''},
        ];
        scope.preferences.dietaryRequirements = {
            getStructuredForApiCall: function () {
                return 'chunky bunny.';
            },
        };

        scope.nextStep();

        // Only two calls should be made -- one for each human ID. The Mongo ID does not need a call
        // to 'getPackageByHumanId'.
        expect(PackagesFactory.getPackageByHumanId.calls.count()).toBe(2);
        expect(PackagesFactory.getPackageByHumanId.calls.argsFor(0)).toEqual([1]);
        expect(PackagesFactory.getPackageByHumanId.calls.argsFor(1)).toEqual([2]);
    });

    it('should show an error message is an invalid package ID is entered', function() {
        scope.mealPlanSetupForm = {};
        scope.mealPlanSetupForm.$invalid = false;

        makeCtrl();

        scope.preferences.packageDispositionsArray = [
            {packageId: 1, disposition: 1}
        ];

        scope.preferences.startDate = new Date();
        scope.preferences.dietaryRequirements = {
            getStructuredForApiCall: function () {
                return 'chunky bunny.';
            },
        };

        scope.nextStep();

        $httpBackend.expectGET('http://api.localhost:9876/packages/1').respond(
            404,
            {errorTranslation: 'No package for this human ID exists'}
        );

        expect(PackagesFactory.getPackageByHumanId).toHaveBeenCalled();

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();

        expect(NotificationService.notifyError).toHaveBeenCalled();

        expect(MealPlanFactory.setCustomerMealPlanRequirements).not.toHaveBeenCalled();

    });

    it('should call setCustomerMealPlanRequirements if all required fields are correctly filled', function() {
        scope.mealPlanSetupForm = {};
        scope.mealPlanSetupForm.$invalid = false;

        makeCtrl();

        scope.preferences.packageDispositionsArray = [
            {packageId: 'aaaa1111aaaa1111aaaa1111', disposition: 1},
            {packageId: 'bbbb2222bbbb2222bbbb2222', disposition: 2},
            {packageId: 1, disposition: 2},
        ];

        scope.preferences.startDate = new Date();
        scope.preferences.dietaryRequirements = {
            getStructuredForApiCall: function () {
                return 'chunky bunny.';
            },
        };

        scope.nextStep();

        $httpBackend.expectGET('http://api.localhost:9876/packages/1').respond(
            200,
            {id: '22443ab98798de987987ad98', humanId: 1}
        );

        expect(PackagesFactory.getPackageByHumanId).toHaveBeenCalled();

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();

        expect(MealPlanFactory.setCustomerMealPlanRequirements).toHaveBeenCalled();
        var setRequirementsCallArgs = MealPlanFactory.setCustomerMealPlanRequirements.calls.mostRecent().args;
        expect(setRequirementsCallArgs[1].dietaryRequirements).toBe('chunky bunny.');
    });

    it('should not call setCustomerMealPlanRequirements if all required fields are not correctly filled', function() {
        scope.mealPlanSetupForm = {};
        scope.mealPlanSetupForm.$invalid = true;

        makeCtrl();

        scope.nextStep();

        expect(MealPlanFactory.setCustomerMealPlanRequirements).not.toHaveBeenCalled();
    });
});
