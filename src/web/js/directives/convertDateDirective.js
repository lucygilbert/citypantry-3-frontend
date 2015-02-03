angular.module('cp.controllers.admin').directive('convertDate',
        function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            ngModelController.$formatters.push(function(modelValue) {
                return $filter('date')(modelValue, 'dd/MM/yyyy HH:mm');
            });
            
            ngModelController.$parsers.push(function(viewValue) {
                var bits = viewValue.split(/\D/);
                return $filter('date')(new Date(bits[2], bits[1], bits[0], bits[3], bits[4]), 'yyyy-MM-ddTHH:mm:ssZ');
            });
        }
    };
});
