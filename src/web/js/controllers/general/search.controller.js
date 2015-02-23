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
    $scope.headCountOptions = OrdersFactory.getHeadCountOptions(1000, 1);
    $scope.timeOptions = PackagesFactory.getDeliveryTimeOptions();

    let isOnSearchPage = true;

    $rootScope.$watch('bannerSearchName', function(name) {
        if (isOnSearchPage) {
            $location.search('name', name).replace();
        }
    });

    $scope.$watch('search.maxBudget', function(maxBudget) {
        if (Number(maxBudget) > 0) {
            search();
        }
    });

    $scope.$watch('search.headCount', () => search());

    $scope.$watch('search.time', () => search());

    $scope.$watch('search.eventType', () => search());

    $scope.$watch('pickedDate', (date) => {
        if (!date) {
            return;
        }

        $scope.search.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        console.log(date, $scope.search.date);
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
                $scope.search.date, ($scope.search.eventType ? $scope.search.eventType.id : undefined))
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
