angular.module('cp').directive('cpPackageCard', function(getTemplateUrl) {
    return {
        restrict: 'EA',
        scope: {
            package: '=',
            searchParams: '='
        },
        templateUrl: getTemplateUrl('directives/cp-package-card.html')
    };
});
