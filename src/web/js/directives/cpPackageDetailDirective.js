angular.module('cp').directive('cpPackageDetail', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            package: '='
        },
        templateUrl: getTemplateUrl('directives/cp-package-detail.html')
    };
});
