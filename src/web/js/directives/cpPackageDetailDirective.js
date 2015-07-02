angular.module('cp').directive('cpPackageDetail', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            package: '=',
            showTeamReviewLink: '=',
            teamReviewCustomerId: '=',
            teamReviewOrderId: '='
        },
        templateUrl: getTemplateUrl('directives/cp-package-detail.html')
    };
});
