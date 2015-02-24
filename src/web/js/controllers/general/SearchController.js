angular.module('cp.controllers.general').controller('SearchController',
        function($scope, $rootScope, PackagesFactory, OrdersFactory, NotificationService,
        $routeParams, $location, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Search catering packages');
    SecurityService.requireLoggedIn();

    $scope.search = {
        name: $routeParams.name,
        postcode: $routeParams.postcode,
        maxBudget: undefined,
        headCount: undefined,
        time: undefined,
        date: undefined
    };

    $scope.isSearching = true;

    $scope.minPackageCost = 1;
    $scope.maxPackageCost = 20;
    $scope.headCountOptions = OrdersFactory.getHeadCountOptions(500, 1);
    $scope.timeOptions = PackagesFactory.getDeliveryTimeOptions();

    let isOnSearchPage = true;

    $rootScope.$watch('bannerSearchName', function(name) {
        if (isOnSearchPage) {
            $location.search('name', name).replace();
        }
    });

    $scope.$watch('search.maxBudget', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        if (isNaN(newValue)) {
            return;
        }
        search();
    });

    $scope.$watch('search.headCount', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        search();
    });

    $scope.$watch('search.time', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        search();
    });

    $scope.$watch('search.eventType', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        search();
    });

    $scope.$watch('search.cuisineType', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        search();
    });

    $scope.$watch('pickedDate', (date, oldDate) => {
        if (typeof date === 'undefined') {
            return;
        }
        if (date === oldDate) {
            return;
        }

        if (date === null) {
            // User clicked the "clear" button. Set to undefined so that the default param value
            // (empty string) in PackagesFactory.search() gets used in the search URL query string.
            $scope.search.date = undefined;
        } else {
            $scope.search.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        }

        search();
    });

    $scope.$on('$destroy', () => isOnSearchPage = false);

    $scope.openDatePicker = function($event) {
        // Need to call these, otherwise the popup won't open (a click outside
        // of the popup closes it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isDatePickerOpen = true;
    };

    if ($routeParams.name && !$rootScope.bannerSearchName) {
        $rootScope.bannerSearchName = $routeParams.name;
    }

    function search() {
        PackagesFactory.searchPackages($scope.search.name, $scope.search.postcode,
                $scope.search.maxBudget, $scope.search.headCount, $scope.search.time,
                $scope.search.date, ($scope.search.eventType ? $scope.search.eventType.id : undefined),
                ($scope.search.cuisineType ? $scope.search.cuisineType.id : undefined))
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
