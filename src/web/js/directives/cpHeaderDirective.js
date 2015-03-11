angular.module('cp.controllers.general').directive('cpHeader', function() {
    return {
        controller: 'HeaderController',
        restrict: 'EA',
        templateUrl: '/dist/templates/directives/cp-header.html'
    };
});
