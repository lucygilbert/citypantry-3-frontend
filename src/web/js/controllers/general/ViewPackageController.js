angular.module('cp.controllers.general').controller('ViewPackageController',
        function($scope, $routeParams, PackagesFactory, NotificationService, DocumentTitleService,
        LoadingService, SecurityService, $sce) {
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

            $scope.facebookUrl = $sce.trustAsResourceUrl('//www.facebook.com/plugins/like.php?href=https://citypantry.com/package/' + $scope.package.id + '&width=90&height=21&colorscheme=light&layout=button_count&action=like&show_faces=false&send=false');
            $scope.twitterUrl = $sce.trustAsResourceUrl('https://platform.twitter.com/widgets/tweet_button.html?via=CityPantry&text=' + encodeURIComponent($scope.package.name + ' by ' + $scope.package.vendor.name));
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
