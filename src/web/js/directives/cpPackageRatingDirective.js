angular.module('cp').directive('cpPackageRating', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            summary: '=cpSummary',
            style: '@cpStyle'
        },
        templateUrl: getTemplateUrl('directives/cp-package-rating.html'),
        controller: 'cpPackageRatingController'
    };
});

angular.module('cp').controller('cpPackageRatingController', function($scope) {
    switch ($scope.style) {
        case 'horizontal':
            $scope.listClass = 'cp-package-rating-inline';
            $scope.attributeNameClass = 'cp-package-rating-inline-attribute';
            $scope.attributeValueClass = 'cp-package-rating-inline-rating';
            break;
        case 'vertical':
            $scope.listClass = 'cp-package-rating-attributes';
            $scope.attributeNameClass = 'cp-package-rating-attribute';
            $scope.attributeValueClass = 'cp-package-rating-rating';
            break;
        default:
            throw new Error('Unexpected cp-package-rating style: ' + $scope.style);
    }
});
