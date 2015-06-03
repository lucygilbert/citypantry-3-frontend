describe('AdminMealPlanSetupMealPreferencesController', function() {
    'use strict';

    var scope;
    var $httpBackend;
    var makeCtrl;
    var NotificationService;
    var PackagesFactory;
    var MealPlanFactory;
    var CustomersFactory;
    var setCustomerMealPlanRequirementsPromise;
    var getPackageByHumanIdPromise;
    var rootScope;

    beforeEach(function() {
        module('cp');
    });

    beforeEach(inject(function($controller, $rootScope, _NotificationService_, _PackagesFactory_,
            _MealPlanFactory_, _CustomersFactory_, _$httpBackend_) {
        scope = $rootScope.$new();
        rootScope = $rootScope;
        $httpBackend = _$httpBackend_;
        NotificationService = _NotificationService_;
        PackagesFactory = _PackagesFactory_;
        MealPlanFactory = _MealPlanFactory_;
        CustomersFactory = _CustomersFactory_;

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
        spyOn(MealPlanFactory, 'getCustomerMealPlanRequirements').and.returnValue(newPromise());

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

    it('should call getPackageByHumanId for each non-null package disposition', function() {
        scope.mealPlanSetupForm = {};
        scope.mealPlanSetupForm.$invalid = false;

        makeCtrl();

        scope.preferences.startDate = new Date();
        scope.preferences.packageDispositions = [
            {
                packageHumanId: 1,
                disposition: 1,
            },
            {
                packageHumanId: null,
                disposition: 2,
            },
            {
                packageHumanId: 4,
                disposition: null,
            },
            {
                packageHumanId: 2,
                disposition: 2,
            },
            {
                packageHumanId: '',
                disposition: '',
            },
        ];
        scope.preferences.dietaryRequirements = {
            getStructuredForApiCall: function () {
                return 'chunky bunny.';
            },
        };

        scope.nextStep();

        expect(PackagesFactory.getPackageByHumanId.calls.count()).toBe(2);
    });

    it('should show an error message is an invalid package ID is entered', function() {
        scope.mealPlanSetupForm = {};
        scope.mealPlanSetupForm.$invalid = false;

        makeCtrl();

        scope.preferences.packageDispositions = [
            {
                packageHumanId: 1,
                disposition: 1,
            },
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

        scope.preferences.packageDispositions = [
            {
                packageHumanId: 1,
                disposition: 1,
            },
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

        expect(MealPlanFactory.setCustomerMealPlanRequirements).toHaveBeenCalled();

        $httpBackend.verifyNoOutstandingExpectation();
    });

    it('should not call setCustomerMealPlanRequirements if all required fields are not correctly filled', function() {
        scope.mealPlanSetupForm = {};
        scope.mealPlanSetupForm.$invalid = true;

        makeCtrl();

        scope.nextStep();

        expect(MealPlanFactory.setCustomerMealPlanRequirements).not.toHaveBeenCalled();
    });
});
