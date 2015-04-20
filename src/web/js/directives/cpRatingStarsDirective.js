angular.module('cp').directive('cpRatingStars', function(getTemplateUrl) {
    return {
        restrict: 'A',
        scope: {
            value: '=cpRatingStars'
        },
        templateUrl: getTemplateUrl('directives/cp-rating-stars.html'),
        controller: 'cpRatingStarsController'
    };
});

angular.module('cp').controller('cpRatingStarsController', function($scope) {
    $scope.getStarClass = (star) => {
        if ($scope.value - star >= 0) {
            return 'icon-star';
        } else if ($scope.value - star >= -0.5) {
            return 'icon-star-half-o';
        } else {
            return 'icon-star-o';
        }
    };
});
