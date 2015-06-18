angular.module('cp.controllers.admin').controller('AdminEditReviewController',
        function($scope, $routeParams, ReviewFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService) {
    DocumentTitleService('Edit review');
    SecurityService.requireStaff();

    ReviewFactory.getReview($routeParams.reviewId)
        .success(response => {
            $scope.review = response.review;
            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.errorTranslation));
});
