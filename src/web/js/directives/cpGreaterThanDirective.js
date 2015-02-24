angular.module('cp.controllers.general').directive('cpGreaterThan', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            var validate = function(viewValue) {
                var comparisonModel = attrs.cpGreaterThan;
                if (!viewValue || !comparisonModel) {
                    ngModelController.$setValidity('greaterThan', true);
                }

                ngModelController.$setValidity('greaterThan', (parseInt(viewValue, 10) > parseInt(comparisonModel, 10)));

                return viewValue;
            };

            ngModelController.$parsers.unshift(validate);
            ngModelController.$formatters.push(validate);

            attrs.$observe('cpGreaterThan', comparisonModel => {
                return validate(ngModelController.$viewValue);
            });
        }
    };
});
