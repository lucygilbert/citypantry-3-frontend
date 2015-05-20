describe('cpDietaryRequirementsForm directive controller', function() {
    'use strict';

    var scope;
    var makeCtrl;
    var NotificationService;
    var PackagesFactory;
    var dietaryRequirementsHttpRequest;

    var vegan = {
        id: 'd1',
        name: 'Vegan',
    };
    var vegetarian = {
        id: 'd2',
        name: 'Vegetarian',
    };
    var halal = {
        id: 'd3',
        name: 'Halal',
    };

    beforeEach(function () {
        module('cp');
    });

    beforeEach(inject(function ($controller, $rootScope, _NotificationService_, _PackagesFactory_) {
        scope = $rootScope.$new();
        NotificationService = _NotificationService_;
        PackagesFactory = _PackagesFactory_;

        makeCtrl = function () {
            $controller('cpDietaryRequirementsFormController', {
                $scope: scope,
            });
        };

        dietaryRequirementsHttpRequest = newPromise();
        spyOn(PackagesFactory, 'getDietaryTypes').and.returnValue(dietaryRequirementsHttpRequest);

        scope.model = {
            customInstructions: 'Call if there are problems.',
            requirements: [
                {headCount: 5, requirements: [vegan, vegetarian]},
                {headCount: 8, requirements: [halal]},
                {headCount: 0, requirements: [halal]},
            ],
        };
    }));

    it('will load the available dietary requirements', function() {
        makeCtrl();
        dietaryRequirementsHttpRequest.resolveSuccess({dietaryRequirements: [vegan]});

        expect(PackagesFactory.getDietaryTypes).toHaveBeenCalled();
        expect(scope.options).toEqual([vegan]);
        expect(scope.isLoaded).toBe(true);
    });

    it('should set the head count options, when a max head count is in the scope', function() {
        scope.maxHeadCount = '5';

        makeCtrl();

        expect(scope.headCountOptions.length).toBe(6);
        expect(scope.headCountOptions[0]).toBe(0);
        expect(scope.headCountOptions[5]).toBe(5);
    });

    it('should set the head count options, when no max head count is in the scope', function() {
        makeCtrl();

        expect(scope.headCountOptions.length).toBe(41);
        expect(scope.headCountOptions[0]).toBe(0);
        expect(scope.headCountOptions[40]).toBe(40);
    });

    it('should flatten the requirements into an array of IDs', function() {
        makeCtrl();

        expect(scope.model.requirements[0].requirementIds).toEqual(['d1', 'd2']);
    });

    it('should add a "getStructuredForApiCall" function to the given model', function() {
        makeCtrl();

        expect(typeof scope.model.getStructuredForApiCall).toBe('function');

        var forApiCall = scope.model.getStructuredForApiCall();

        // It should keep the custom instructions without being changed.
        expect(forApiCall.customInstructions).toBe('Call if there are problems.');

        // It should remove any requirements where the head count is zero, and flatten the
        // other requirements to just IDs.
        expect(forApiCall.requirements).toEqual([
            {headCount: 5, requirements: ['d1', 'd2']},
            {headCount: 8, requirements: ['d3']},
        ]);
    });
});
