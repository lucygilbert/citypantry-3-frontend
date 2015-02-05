angular.module('cp.controllers.admin').directive('formatCurrency',
        function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            ngModelController.$formatters.push(function(modelValue) {
                if (modelValue) {
                    return $filter('currency')(modelValue, '£', 2);
                }
            });
        }
    };
});
