angular.module('cp.controllers.general').controller('SearchController',
        function($scope, $rootScope, PackagesFactory, NotificationService, $routeParams, $location) {
    $scope.search = {
        name: $routeParams.name,
        postcode: $routeParams.postcode,
    };

    $scope.isSearching = true;

    $rootScope.$watch('bannerSearchName', function(name) {
        $location.search('name', name).replace();
    });

    if ($routeParams.name && !$rootScope.bannerSearchName) {
        $rootScope.bannerSearchName = $routeParams.name;
    }

    function search() {
        PackagesFactory.searchPackages($scope.search.name, $scope.search.postcode)
            .success(response => {
                if (response.exactVendorNameMatch) {
                    // @todo - redirect to the vendor page.
                }

                $scope.packages = response.packages;
                $scope.eventTypes = response.eventTypes;
                $scope.cuisineTypes = response.cuisineTypes;
                $scope.isSearching = false;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    search();
});
