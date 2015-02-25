angular.module('cp.controllers.general').controller('ViewPackageController',
        function($scope, $routeParams, PackagesFactory, NotificationService, DocumentTitleService, LoadingService, SecurityService) {
    SecurityService.requireLoggedIn();

    const humanId = Number($routeParams.humanIdAndSlug.split('-')[0]);

    PackagesFactory.getPackageByHumanId(humanId)
        .success(response => {
            $scope.package = response;

            for (let i = 0; i < $scope.package.dietaryRequirements.length; i++) {
                const dietaryRequirement = $scope.package.dietaryRequirements[i];
                if (dietaryRequirement.name === 'Vegetarian') {
                    $scope.vegetarianOption = dietaryRequirement;
                }
            }

            DocumentTitleService($scope.package.name);
            LoadingService.hide();

            loadReviews($scope.package.id);
            loadSimilarPackages($scope.package.id);
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    const loadReviews = (id) => {
        PackagesFactory.getPackageReviews(id)
            .success(response => $scope.reviews = response.reviews)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    const loadSimilarPackages = (id) => {
        PackagesFactory.getSimilarPackages(id)
            .success(response => {
                $scope.otherPackagesBySameVendor = response.otherPackagesBySameVendor;
                $scope.similarPackagesByDifferentVendors = response.similarPackagesByDifferentVendors;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
