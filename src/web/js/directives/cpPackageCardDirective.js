angular.module('cp').directive('cpPackageCard', function() {
    return {
        restrict: 'EA',
        scope: {
            package: '=',
            searchParams: '='
        },
        templateUrl: '/dist/templates/directives/cp-package-card.html'
    };
});
