angular.module('cp.controllers.customer').controller('CustomerOrderTeamReviewsController',
        function($scope, $routeParams, $q, OrdersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, TeamReviewFactory) {
    // Instead of the normal way of requiring a customer (calling `SecurityService.requireCustomer()`
    // without a is-logged-in condition), do the is-logged-in condition so we can put a return
    // statement. This is because if the customer coming to this page from an email link and is
    // currently logged out, the experience of seeing "You are not allowed to view this order" is
    // not nice.
    if (!SecurityService.isLoggedIn()) {
        SecurityService.requireCustomer();
        return;
    }

    $scope.reviewsLimit = 3;

    const loadingPromise1 = OrdersFactory.getOrder($routeParams.id)
        .success(response => {
            $scope.order = response;
            DocumentTitleService(`Team reviews for ${$scope.order.package.name}`);
        });

    const loadingPromise2 = TeamReviewFactory.getTeamReviewsByOrder($routeParams.id)
        .success(response => {
            $scope.averageOverallRating = response.averageOverallRating;
            $scope.reviewsWithComment = response.teamReviews.filter(review => review.review);
        });

    $q.all([loadingPromise1, loadingPromise2])
        .then(() => LoadingService.hide())
        .catch(() => NotificationService.notifyError());
});
