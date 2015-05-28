angular.module('cp').directive('cpOrderDetails', function(getTemplateUrl) {
    return {
        restrict: 'EA',
        scope: {
            order: '='
        },
        templateUrl: getTemplateUrl('directives/cp-order-details.html')
    };
});
