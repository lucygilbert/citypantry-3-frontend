angular.module('cp').directive('cpVendorCard', function(getTemplateUrl) {
    return {
        restrict: 'EA',
        scope: {
            isHireForAnEventDisplayed: '@',
            isSeeAllPackagesDisplayed: '@',
            vendor: '='
        },
        templateUrl: getTemplateUrl('directives/cp-vendor-card.html')
    };
});
