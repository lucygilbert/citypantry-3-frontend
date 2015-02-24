angular.module('cp.controllers.general').controller('ViewPackageController',
        function($scope, $routeParams, PackagesFactory, NotificationService, DocumentTitleService, LoadingService, SecurityService) {
    SecurityService.requireLoggedIn();

    const humanId = Number($routeParams.humanIdAndSlug.split('-')[0]);

    PackagesFactory.getPackageByHumanId(humanId)
        .success(response => {
            $scope.package = response;
            DocumentTitleService($scope.package.name);
            LoadingService.hide();

            loadReviews($scope.package.id);
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    const loadReviews = (id) => {
        PackagesFactory.getPackageReviews(id)
            .success(response => $scope.reviews = response.reviews)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
