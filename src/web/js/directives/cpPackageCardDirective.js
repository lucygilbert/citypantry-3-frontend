angular.module('cp').directive('cpPackageCard', function(getTemplateUrl) {
    return {
        restrict: 'EA',
        scope: {
            package: '='
        },
        templateUrl: getTemplateUrl('directives/cp-package-card.html')
    };
});
