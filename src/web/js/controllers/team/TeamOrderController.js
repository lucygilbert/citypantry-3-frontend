angular.module('cp.controllers.team').controller('TeamOrderController', function($scope,
        $routeParams, OrdersFactory, TeamReviewFactory, DocumentTitleService, LoadingService,
        NotificationService) {
    DocumentTitleService('Your company\'s order');

    const customerId = $routeParams.customerId;
    $scope.customerId = customerId;

    const orderId = $routeParams.orderId;

    let teamReviewId;

    $scope.hasSavedOverallRating = false;
    $scope.canReview = false;
    $scope.review = {};

    OrdersFactory.getCustomerTeamOrder(customerId, orderId)
        .success(response => {
            $scope.order = response.order;
            $scope.canReview = response.order.hasRequestedDeliveryDatePassed;
            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    const saveOverallRating = () => {
        LoadingService.show();

        if (teamReviewId) {
            // The overall rating has already been saved. Instead of creating a new review, update
            // the one created when the overall rating was saved.
            $scope.saveReview();
            return;
        }

        TeamReviewFactory.createTeamReviewForOrder(orderId, {overallRating: $scope.review.overallRating})
            .success(response => {
                teamReviewId = response.teamReview.id;
                $scope.hasSavedOverallRating = true;
                LoadingService.hide();
            })
            .error(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.saveReview = () => {
        LoadingService.show();

        TeamReviewFactory.updateTeamReview(teamReviewId, $scope.review)
            .success(() => {
                NotificationService.notifySuccess('Thanks for your feedback!');
                LoadingService.hide();
            })
            .error(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.$watch('review.overallRating', (newValue) => {
        if (typeof newValue === 'number' && newValue >= 1 && newValue <= 5) {
            saveOverallRating();
        }
    });
});
