angular.module('cp.controllers.general').controller('SearchController',
        function($scope, PackagesFactory, OrdersFactory, NotificationService, DocumentTitleService,
        LoadingService, $q, $filter, SearchService, $anchorScroll, FacebookAnalyticsService,
        AngularticsAnalyticsService) {
    FacebookAnalyticsService.track('6031347907146');
    DocumentTitleService('Search catering packages');

    const PAGINATION_LENGTH = 20;

    $scope.search = {
        name: SearchService.getName(),
        postcode: SearchService.getPostcode(),
        maxBudget: SearchService.getMaxBudget(),
        headCount: SearchService.getHeadCount(),
        time: SearchService.getDeliveryTime(),
        date: SearchService.getDeliveryDate(),
        eventTypes: SearchService.getEventTypes(),
        cuisineTypes: SearchService.getCuisineTypes(),
        dietaryRequirements: SearchService.getDietaryRequirements()
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

    // This limit is not fixed - it increases when the user clicks 'show more' (triggering
    // `$scope.showMore`).
    const displayedPackagesCount = SearchService.getDisplayedPackagesCount();
    if (displayedPackagesCount) {
        $scope.packagesLimit = displayedPackagesCount;
    } else {
        $scope.packagesLimit = PAGINATION_LENGTH;
    }

    function init() {
        const promise1 = PackagesFactory.getEventTypes()
            .success(response => {
                $scope.eventTypes = response.eventTypes;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise2 = PackagesFactory.getCuisineTypes()
            .success(response => {
                $scope.cuisineTypes = response.cuisineTypes.filter(cuisineType => cuisineType.hasPackages);
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise3 = PackagesFactory.getDietaryTypes()
            .success(response => {
                $scope.dietaryRequirements = response.dietaryRequirements;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2, promise3]).then(() => {
            if ($scope.search.date) {
                $scope.pickedDate = $filter('date')($scope.search.date, 'dd/MM/yyyy');
            }

            search();
        });
    }

    init();

    const lastPackageSelected = SearchService.getLastPackageSelected();
    if (lastPackageSelected) {
        $anchorScroll(lastPackageSelected);
    }

    $scope.clearAllFilters = () => {
        $scope.search = {
            postcode: $scope.search.postcode,
            eventTypes: [],
            cuisineTypes: [],
            dietaryRequirements: []
        };
        $scope.pickedDate = null;
        search();
    };

    $scope.changeMaxBudget = function() {
        if ($scope.search.tempMaxBudget === $scope.search.maxBudget) {
            return;
        }
        if (isNaN($scope.search.tempMaxBudget)) {
            return;
        }
        $scope.search.maxBudget = $scope.search.tempMaxBudget;
        SearchService.setMaxBudget($scope.search.maxBudget);
        search();
    };

    $scope.$watch('search.headCount', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        SearchService.setHeadCount(newValue);
        search();
    });

    $scope.$watch('search.time', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        SearchService.setDeliveryTime(newValue);
        search();
    });

    $scope.$watchCollection('search.eventTypes', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        SearchService.setEventTypes(newValue);
        search();
    });

    $scope.$watchCollection('search.cuisineTypes', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        SearchService.setCuisineTypes(newValue);
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
            // The date will be a string if the date picker was set manually.
            if (typeof date === 'string') {
                const bits = date.split(/\D/);
                $scope.search.date = bits[2] + '-' + bits[1] + '-' + bits[0];
                SearchService.setDeliveryDate(new Date(bits[2], bits[1] - 1, bits[0]));
            } else {
                $scope.search.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                SearchService.setDeliveryDate(date);
            }
        }

        search();
    });

    $scope.$watch('search.postcode', (newValue, oldValue) => {
        SearchService.setPostcode(newValue);
        // Don't perform a search, because we want to wait until the enter key is pressed before
        // searching (which is trigger by `$scope.searhAndBlurIfEnterKey`).
    });

    $scope.$watchCollection('search.dietaryRequirements', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        SearchService.setDietaryRequirements(newValue);
        search();
    });

    $scope.$watch('search.name', (newValue, oldValue) => {
        if (newValue === oldValue) {
            return;
        }
        SearchService.setName(newValue);
        search();
    });

    $scope.openDatePicker = function($event) {
        // Need to call these, otherwise the popup won't open (a click outside
        // of the popup closes it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isDatePickerOpen = true;
    };

    $scope.showMore = function() {
        $scope.packagesLimit += PAGINATION_LENGTH;
        SearchService.setDisplayedPackagesCount($scope.packagesLimit);
    };

    // The promise assigned to this is ultimately passed to the $http service as its `timeout`
    // parameter. If a new search is made before a pending search finishes, the promise is aborted,
    // causing the pending search HTTP request to be cancelled and its results completely ignored.
    // This prevents results for an outdated search being seen by the user when they have made a new
    // search. It also prevents search promises resolving out of order, which happens if the API
    // takes longer to serve the `N-1` search than the current `N` search.
    let deferredSearchAbort;

    function search() {
        if (deferredSearchAbort) {
            deferredSearchAbort.resolve();
        }

        deferredSearchAbort = $q.defer();

        PackagesFactory.searchPackages(
                $scope.search.name,
                $scope.search.postcode,
                $scope.search.maxBudget, $scope.search.headCount, $scope.search.time,
                $scope.search.date,
                // If all event types are selected, don't send any (same effect, but shorter URL).
                ($scope.search.eventTypes.length !== $scope.eventTypes.length ? $scope.search.eventTypes : []),
                // If all cuisine types are selected, don't send any (same effect, but shorter URL).
                ($scope.search.cuisineTypes.length !== $scope.cuisineTypes.length ? $scope.search.cuisineTypes : []),
                // If all dietary requirements are selected, don't send any (same effect, but shorter URL).
                ($scope.search.dietaryRequirements.length !== $scope.dietaryRequirements.length ? $scope.search.dietaryRequirements : []),
                undefined,
                deferredSearchAbort.promise)
            .success(response => {
                $scope.packages = response.packages;
                $scope.isSearching = false;
                LoadingService.hide();
                trackSearchAndResults();
            })
            .catch(response => {
                if (response.status === 0) {
                    // The request was cancelled because a new search request has been made.
                    // Do not show an error.
                    return;
                }
                NotificationService.notifyError(response.data.errorTranslation);
            });
    }

    function trackSearchAndResults() {
        AngularticsAnalyticsService.trackSearchAndResults($scope.packages, $scope.search);
    }

    $scope.searchAndBlurIfEnterKey = function(keyEvent) {
        if (keyEvent.which === 13) {
            search();
            keyEvent.target.blur();
        }
    };
});
