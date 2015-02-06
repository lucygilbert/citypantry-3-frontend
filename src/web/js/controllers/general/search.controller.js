angular.module('cp.controllers.general').controller('SearchController',
        function($scope, $rootScope, PackagesFactory, NotificationService, $routeParams, $location, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Search catering packages');
    SecurityService.requireLoggedIn();

    $scope.search = {
        name: $routeParams.name,
        postcode: $routeParams.postcode,
    };

    $scope.isSearching = true;

    let isOnSearchPage = true;

    $rootScope.$watch('bannerSearchName', function(name) {
        if (isOnSearchPage) {
            $location.search('name', name).replace();
        }
    });

    $scope.$on('$destroy', () => isOnSearchPage = false);

    if ($routeParams.name && !$rootScope.bannerSearchName) {
        $rootScope.bannerSearchName = $routeParams.name;
    }

    function search() {
        PackagesFactory.searchPackages($scope.search.name, $scope.search.postcode)
            .success(response => {
                if (response.exactVendorNameMatch) {
                    $location.path(`/vendor/${response.vendor.id}-${response.vendor.slug}`);
                }

                $scope.packages = response.packages;
                $scope.eventTypes = response.eventTypes;
                $scope.cuisineTypes = response.cuisineTypes;
                $scope.isSearching = false;

                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    search();
});
