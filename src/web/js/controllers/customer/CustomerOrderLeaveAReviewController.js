angular.module('cp.controllers.customer').controller('CustomerOrderLeaveAReviewController',
        function($scope, $routeParams, OrdersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, $location) {
    SecurityService.requireCustomer();

    $scope.isPublicString = '1';

    $scope.review = {
        review: '',
        isDeliveredOnTime: null,
        foodQualityRating: 0,
        presentationRating: 0,
        deliveryRating: 0,
        overallRating: 0,
        recommendToFriendRating: 0,
        isPublic: true
    };

    // An array of the numbers 1 to 10, used for creating the 'recommend to friend' rating view.
    $scope.oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    OrdersFactory.getOrder($routeParams.id)
        .success(response => {
            $scope.order = response;

            // An order can only be reviewed by the office manager once, so ensure the order
            // has not been reviewed already.
            if ($scope.order.hasBeenReviewed) {
                NotificationService.notifyError('You have already reviewed this order.');
                $location.path('/customer/orders');
                return;
            }

            DocumentTitleService(`Leave a review for: ${$scope.order.package.name}`);
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.setRecommendToFriendRating = (value) => {
        $scope.review.recommendToFriendRating = value;
    };

    $scope.save = () => {
        $scope.errors = {};

        // Ensure each of the food quality / presentation / etc. rating have all been set.
        ['foodQuality', 'presentation', 'delivery', 'overall'].forEach((ratingType) => {
            $scope.errors[ratingType + 'RatingRequiredError'] = (!$scope.review[ratingType + 'Rating']);
        });

        // Ensure the 'is delivered on time' feedback is set.
        $scope.errors.isDeliveredOnTimeRequiredError = ($scope.review.isDeliveredOnTime !== '0' && $scope.review.isDeliveredOnTime !== '1');

        // Ensure the 'recommend to friend' rating is set.
        $scope.errors.recommendToFriendRatingRequiredError = !$scope.review.recommendToFriendRating;

        const hasErrors = Object.values($scope.errors).filter(x => x).length > 0;

        if (hasErrors) {
            NotificationService.notifyError('There are some errors - please see above.');
            return;
        }

        $scope.review.isPublic = !!parseInt($scope.isPublicString, 10);

        LoadingService.show();

        OrdersFactory.addOrderReview($routeParams.id, $scope.review)
            .success(() => {
                NotificationService.notifySuccess('Thanks for your review.');
                $location.path('/customer/orders');
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
