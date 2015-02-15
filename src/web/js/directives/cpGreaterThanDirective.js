angular.module('cp.controllers.general').directive('cpGreaterThan', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            var validate = function(viewValue) {
                var comparisonModel = attrs.cpGreaterThan;
                if (!viewValue || !comparisonModel) {
                    // It is valid because we have nothing to compare against.
                    ngModelController.$setValidity('greaterThan', true);
                }

                // It is valid if view is greater than the model we are comparing against.
                ngModelController.$setValidity('greaterThan', (parseInt(viewValue, 10) > parseInt(comparisonModel, 10)));

                return viewValue;
            };

            ngModelController.$parsers.unshift(validate);
            ngModelController.$formatters.push(validate);

            attrs.$observe('cpGreaterThan', comparisonModel => {
                // Whenever the comparison model changes we will re-validate.
                return validate(ngModelController.$viewValue);
            });
        }
    };
});
