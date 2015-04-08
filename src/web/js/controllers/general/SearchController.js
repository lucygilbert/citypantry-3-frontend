angular.module('cp.controllers.general').controller('SearchController',
        function($scope, $rootScope, PackagesFactory, OrdersFactory, NotificationService,
        $routeParams, $location, DocumentTitleService, SecurityService, LoadingService, $q) {
    DocumentTitleService('Search catering packages');
    SecurityService.requireLoggedIn();

    $scope.search = {
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
    $scope.minDate = new Date();
    $scope.eventTypes = [];
    $scope.isAdvancedSearchVisible = false;
    $scope.cuisineTypes = [];
    $scope.dietaryRequirements = [];
    $scope.packagingTypeOptions = PackagesFactory.getPackagingTypeOptions();
    $scope.packagesLimit = 20;

    let isOnSearchPage = true;

    function init() {
        const promise1 = PackagesFactory.getEventTypes()
            .success(response => {
                $scope.eventTypes = response.eventTypes;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise2 = PackagesFactory.getCuisineTypes()
            .success(response => {
                $scope.cuisineTypes = response.cuisineTypes;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise3 = PackagesFactory.getDietaryTypes()
            .success(response => {
                $scope.dietaryRequirements = response.dietaryRequirements;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2, promise3]).then(() => {
            $scope.search.eventTypes = [];
            $scope.search.cuisineTypes = [];
            $scope.search.dietaryRequirements = [];
            $scope.search.packagingType = $scope.packagingTypeOptions[2].value; // "I don't mind".

            search();
        });
    }

    init();

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

    $scope.$watchCollection('search.eventTypes', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        search();
    });

    $scope.$watchCollection('search.cuisineTypes', (newValue, oldValue) => {
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

    $scope.$watch('search.postcode', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        search();
    });

    $scope.$watchCollection('search.dietaryRequirements', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        search();
    });

    $scope.$watch('search.packagingType', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        search();
    });

    $scope.$on('$destroy', () => isOnSearchPage = false);

    $scope.$watch('sort', () => $scope.packages = sortPackages());

    $scope.openDatePicker = function($event) {
        // Need to call these, otherwise the popup won't open (a click outside
        // of the popup closes it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isDatePickerOpen = true;
    };

    $scope.showMore = function() {
        $scope.packagesLimit += 20;
    };

    function search() {
        PackagesFactory.searchPackages(undefined, $scope.search.postcode,
                $scope.search.maxBudget, $scope.search.headCount, $scope.search.time,
                $scope.search.date, ($scope.search.eventTypes.length !== $scope.eventTypes.length ? $scope.search.eventTypes : []),
                ($scope.search.cuisineTypes.length !== $scope.cuisineTypes.length ? $scope.search.cuisineTypes : []),
                ($scope.search.dietaryRequirements.length !== $scope.dietaryRequirements.length ? $scope.search.dietaryRequirements : []),
                $scope.search.packagingType)
            .success(response => {
                if (response.exactVendorNameMatch) {
                    $location.path(`/vendor/${response.vendor.id}-${response.vendor.slug}`);
                }

                $scope.packages = response.packages;
                $scope.isSearching = false;

                if ($scope.sort) {
                    $scope.packages = sortPackages();
                }

                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    function sortPackages() {
        if ($scope.sort === 'priceLowToHigh') {
            return $scope.packages.sort((a, b) => a.costIncludingVat >= b.costIncludingVat);
        }
        if ($scope.sort === 'priceHighToLow') {
            return $scope.packages.sort((a, b) => a.costIncludingVat <= b.costIncludingVat);
        }
    }
});
