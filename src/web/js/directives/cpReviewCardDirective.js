angular.module('cp').directive('cpReviewCard', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            'review': '='
        },
        templateUrl: getTemplateUrl('directives/cp-review-card.html'),
        controller: function($scope, OrdersFactory, NotificationService) {
            OrdersFactory.getOrder($scope.review.orderId)
                .success(response => $scope.order = response)
                .error(response => NotificationService.notifyError(response.data.errorTranslation));
        }
    };
});
