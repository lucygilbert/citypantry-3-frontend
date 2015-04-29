angular.module('cp').directive('cpPackageCard', function(getTemplateUrl) {
    return {
        restrict: 'EA',
        scope: {
            package: '=',
            showOrderNowButtonOnHover: '@'
        },
        templateUrl: getTemplateUrl('directives/cp-package-card.html')
    };
});
