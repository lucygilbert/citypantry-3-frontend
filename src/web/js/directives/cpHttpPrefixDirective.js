angular.module('cp.controllers.general').directive('cpHttpPrefix', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            ngModelController.$parsers.push(function(viewValue) {
                if (viewValue && !/^(https?):\/\//i.test(viewValue)) {
                    return 'http://' + viewValue;
                } else {
                    return viewValue;
                }
            });
        }
    };
});
