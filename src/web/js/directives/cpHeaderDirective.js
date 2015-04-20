angular.module('cp.controllers.general').directive('cpHeader', function(getTemplateUrl) {
    return {
        controller: 'HeaderController',
        restrict: 'EA',
        templateUrl: getTemplateUrl('directives/cp-header.html')
    };
});
