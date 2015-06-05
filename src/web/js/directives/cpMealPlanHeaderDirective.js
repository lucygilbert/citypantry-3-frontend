angular.module('cp').directive('cpMealPlanHeader', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            duration: '=cpDuration',
            deliveryAddress: '=cpDeliveryAddress',
            numberOfOrders: '=cpNumberOfOrders',
            totalCost: '=cpTotalCost'
        },
        templateUrl: getTemplateUrl('directives/cp-meal-plan-header.html')
    };
});
