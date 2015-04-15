angular.module('cp.controllers.customer').controller('CustomerOrderLeaveAReviewController',
        function($scope, $routeParams, OrdersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, $location) {
    SecurityService.requireCustomer();

    OrdersFactory.getOrder($routeParams.id)
        .success(response => {
            $scope.order = response;
            DocumentTitleService(`Leave a review for: ${$scope.order.package.name}`);
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.save = function() {
        if (!$scope.reviewForm.$valid) {
            $scope.reviewForm.$submitted = true;
            return;
        }

        LoadingService.show();

        OrdersFactory.addOrderReview($routeParams.id, $scope.review)
            .success(() => {
                NotificationService.notifySuccess('Thanks for your review.');
                $location.path('/customer/orders');
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
