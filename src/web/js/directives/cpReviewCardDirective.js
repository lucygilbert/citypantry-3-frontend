angular.module('cp').directive('cpReviewCard', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            'review': '='
        },
        templateUrl: getTemplateUrl('directives/cp-review-card.html'),
        controller: function($scope, OrdersFactory, NotificationService, ReviewFactory) {
            OrdersFactory.getOrder($scope.review.orderId)
                .success(response => $scope.order = response)
                .error(response => NotificationService.notifyError(response.data.errorTranslation));

            $scope.toggleIsPublic = () => {
                ReviewFactory.setReviewAsPublic(!$scope.review.isPublic, $scope.review.id)
                    .success(response => $scope.review = response.review)
                    .error(response => NotificationService.notifyError(response.data.errorTranslation));
            };
        }
    };
});
