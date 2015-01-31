angular.module('cp.controllers.general').controller('SearchController',
        function($scope, $rootScope, PackagesFactory, NotificationService, $routeParams) {
    $scope.search = {
        name: $routeParams.name || $rootScope.bannerSearchName || '',
        postcode: $routeParams.postcode,
    };

    $rootScope.$watch('bannerSearchName', function(name) {
        if ($scope.search.name !== name) {
            $scope.search.name = name;
            search();
        }
    });

    if ($routeParams.name && !$rootScope.bannerSearchName) {
        $rootScope.bannerSearchName = $routeParams.name;
    }

    let lastSearch;

    function search() {
        if (lastSearch && angular.equals($scope.search, lastSearch)) {
            return;
        }

        lastSearch = angular.copy($scope.search);
        $scope.searching = true;

        PackagesFactory.searchPackages($scope.search.name, $scope.search.postcode)
            .success(response => {
                if (response.exactVendorNameMatch) {
                    // @todo - redirect to the vendor page.
                }

                $scope.packages = response.packages;
                $scope.eventTypes = response.eventTypes;
                $scope.cuisineTypes = response.cuisineTypes;
                $scope.searching = false;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    search();
});
