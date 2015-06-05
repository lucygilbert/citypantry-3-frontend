angular.module('cp').directive('cpReviewCard', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            'review': '='
        },
        templateUrl: getTemplateUrl('directives/cp-review-card.html'),
        controller: 'cpReviewCardController'
    };
});

angular.module('cp').controller('cpReviewCardController',
        function($scope, OrdersFactory, NotificationService, ReviewFactory) {
    OrdersFactory.getOrder($scope.review.orderId)
        .success(response => $scope.order = response)
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.toggleIsPublic = () => {
        ReviewFactory.setReviewAsPublic(!$scope.review.isPublic, $scope.review.id)
            .success(response => $scope.review = response.review)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
