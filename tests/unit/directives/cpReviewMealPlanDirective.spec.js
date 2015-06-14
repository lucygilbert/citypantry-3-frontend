describe('cpReviewMealPlan directive controller', function() {
    'use strict';

    var scope;
    var makeCtrl;

    beforeEach(module('cp'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        makeCtrl = function () {
            $controller('cpReviewMealPlanController', {
                $scope: scope,
            });
        };

        scope.mealPlan = {
            proposedOrders: [],
        };
    }));

    describe('areOrdersInSameWeek', function() {
        beforeEach(function() {
            makeCtrl();
        });

        it('should return null if there is no previous order', function() {
            var result = scope.areOrdersInSameWeek(
                {requestedDeliveryDate: '2015-06-14'},
                undefined
            );
            expect(result).toBe(null);
        });

        it('should return true if the orders given are in the same week', function() {
            var result = scope.areOrdersInSameWeek(
                {requestedDeliveryDate: '2015-06-14'},
                {requestedDeliveryDate: '2015-06-13'}
            );
            expect(result).toBe(true);

            result = scope.areOrdersInSameWeek(
                {requestedDeliveryDate: '2015-06-12'},
                {requestedDeliveryDate: '2015-06-11'}
            );
            expect(result).toBe(true);

            result = scope.areOrdersInSameWeek(
                {requestedDeliveryDate: '2015-06-15'},
                {requestedDeliveryDate: '2015-06-21'}
            );
            expect(result).toBe(true);
        });

        it('should return false if the orders given are in different weeks', function() {
            var result = scope.areOrdersInSameWeek(
                {requestedDeliveryDate: '2015-06-14'},
                {requestedDeliveryDate: '2015-06-15'}
            );
            expect(result).toBe(false);

            result = scope.areOrdersInSameWeek(
                {requestedDeliveryDate: '2015-06-15'},
                {requestedDeliveryDate: '2015-06-23'}
            );
            expect(result).toBe(false);
        });
    });
});
