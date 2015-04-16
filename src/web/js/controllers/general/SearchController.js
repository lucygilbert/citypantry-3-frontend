angular.module('cp.controllers.general').controller('SearchController',
        function($scope, PackagesFactory, OrdersFactory, NotificationService,
        $routeParams, DocumentTitleService, SecurityService, LoadingService, $q, $filter) {
    DocumentTitleService('Search catering packages');
    SecurityService.requireLoggedIn();

    const PAGINATION_LENGTH = 20;

    $scope.search = {
        postcode: $routeParams.postcode,
        maxBudget: undefined,
        headCount: $routeParams.headCount,
        time: $routeParams.time,
        date: undefined,
        eventTypes: undefined
    };

    $scope.isSearching = true;

    $scope.minPackageCost = 1;
    $scope.maxPackageCost = 20;
    $scope.headCountOptions = OrdersFactory.getHeadCountOptions(500, 1);
    $scope.timeOptions = PackagesFactory.getPackageDeliveryTimeOptions(700, 2400, 30);
    $scope.minDate = new Date();
    $scope.eventTypes = [];
    $scope.isAdvancedSearchVisible = false;
    $scope.cuisineTypes = [];
    $scope.dietaryRequirements = [];
    $scope.packagingTypeOptions = PackagesFactory.getPackagingTypeOptions();
    // This limit is not fixed - it increases when the user clicks 'show more' (triggering
    // `$scope.showMore`).
    $scope.packagesLimit = PAGINATION_LENGTH;

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
            if ($routeParams.date) {
                const bits = $routeParams.date.split(/\D/);
                $scope.pickedDate = $filter('date')(new Date(bits[0], bits[1] - 1, bits[2]), 'dd/MM/yyyy');
            }

            $scope.search.eventTypes = [];
            if ($routeParams.eventTypeId) {
                if ($routeParams.eventTypeId instanceof Array) {
                    $scope.search.eventTypes = $routeParams.eventTypeId;
                } else {
                    $scope.search.eventTypes.push($routeParams.eventTypeId);
                }
            }

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
            // The date will be a string if the URL param "date" is present.
            if (typeof date === 'string') {
                const bits = date.split(/\D/);
                $scope.search.date = bits[2] + '-' + bits[1] + '-' + bits[0];
            } else {
                $scope.search.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            }
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

    $scope.openDatePicker = function($event) {
        // Need to call these, otherwise the popup won't open (a click outside
        // of the popup closes it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isDatePickerOpen = true;
    };

    $scope.showMore = function() {
        $scope.packagesLimit += PAGINATION_LENGTH;
    };

    function search() {
        PackagesFactory.searchPackages(undefined, $scope.search.postcode,
                $scope.search.maxBudget, $scope.search.headCount, $scope.search.time,
                $scope.search.date,
                // If all event types are selected, don't send any (same effect, but shorter URL).
                ($scope.search.eventTypes.length !== $scope.eventTypes.length ? $scope.search.eventTypes : []),
                // If all cuisine types are selected, don't send any (same effect, but shorter URL).
                ($scope.search.cuisineTypes.length !== $scope.cuisineTypes.length ? $scope.search.cuisineTypes : []),
                // If all dietary requirements are selected, don't send any (same effect, but shorter URL).
                ($scope.search.dietaryRequirements.length !== $scope.dietaryRequirements.length ? $scope.search.dietaryRequirements : []),
                $scope.search.packagingType)
            .success(response => {
                $scope.packages = response.packages;
                $scope.isSearching = false;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }
});
