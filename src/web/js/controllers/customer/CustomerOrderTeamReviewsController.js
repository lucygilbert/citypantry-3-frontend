angular.module('cp.controllers.customer').controller('CustomerOrderTeamReviewsController',
        function($scope, $routeParams, $q, OrdersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, TeamReviewFactory) {
    SecurityService.requireCustomer();

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
