angular.module('cp.controllers.general').directive('cpBack', function($window) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.bind('click', () => {
                $window.history.back();
            });
        }
    };
});
