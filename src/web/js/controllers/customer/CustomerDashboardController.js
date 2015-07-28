angular.module('cp.controllers.customer').controller('CustomerDashboardController',
        function($scope, DocumentTitleService, SecurityService, LoadingService, $q, PackagesFactory,
        OrdersFactory, $location, CustomersFactory, NotificationService, $filter, SearchService,
        ABTestService) {

    if (SecurityService.vendorIsLoggedIn()) {
        $location.path('/vendor/orders');
        return;
    }

    DocumentTitleService('Dashboard');

    $scope.deliveryAddresses = [];
    $scope.customer = {};
    $scope.headCountOptions = OrdersFactory.getHeadCountOptions(500, 1);
    $scope.isDatePickerOpen = false;
    $scope.eventTypeOptions = [];
    $scope.minDate = new Date();
    $scope.nextOrder = undefined;
    $scope.timeOptions = PackagesFactory.getPackageDeliveryTimeOptions(700, 2400, 30);

    $scope.search = {
        date: SearchService.getDeliveryDate(),
        // 'eventType' is set from SearchService after all event types have loaded from the API.
        eventType: undefined,
        headCount: SearchService.getHeadCount(),
        // 'newPostcode' are 'postcode' are set later.
        newPostcode: undefined,
        postcode: undefined,
        time: SearchService.getDeliveryTime()
    };

    const loadReviews = (id) => {
        PackagesFactory.getPackageReviews(id)
            .success(response => {
                $scope.reviewsSummary = response.summary;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    function initIfLoggedIn() {
        const promise1 = PackagesFactory.getEventTypes()
            .success(response => $scope.eventTypeOptions = response.eventTypes)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise2 = CustomersFactory.getAddresses()
            .success(response => $scope.deliveryAddresses = response.deliveryAddresses)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise3 = SecurityService.getCustomer()
            .then(customer => $scope.customer = customer)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise4 = OrdersFactory.getNextCustomerOrder()
            .then(nextOrder => $scope.nextOrder = nextOrder)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise5 = PackagesFactory.getRecommendedPackage()
            .success(response => $scope.recommendedPackage = response.recommendedPackage)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2, promise3, promise4, promise5]).then(() => {
            const postcode = SearchService.getPostcode();
            if (postcode) {
                let isNewPostcode = true;
                $scope.deliveryAddresses.forEach(address => {
                    if (postcodeComparison(postcode, address.postcode)) {
                        $scope.search.postcode = postcode;
                        isNewPostcode = false;
                        return false;
                    }
                });
                if (isNewPostcode) {
                    $scope.search.newPostcode = postcode;
                }
            } else {
                if ($scope.deliveryAddresses.length > 0) {
                    $scope.search.postcode = $scope.deliveryAddresses[0].postcode;
                }
            }

            if ($scope.search.date) {
                $scope.pickedDate = $filter('date')($scope.search.date, 'dd/MM/yyyy');
            }

            const eventTypes = SearchService.getEventTypes();
            if (eventTypes.length > 0) {
                $scope.search.eventType = eventTypes[0];
            }

            if ($scope.recommendedPackage) {
                loadReviews($scope.recommendedPackage.id);
            }

            LoadingService.hide();
        });
    }

    function initIfLoggedOut() {
        const promise1 = PackagesFactory.getEventTypes()
            .success(response => $scope.eventTypeOptions = response.eventTypes)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise2 = PackagesFactory.getRecommendedPackage()
            .success(response => {
                $scope.recommendedPackage = response.recommendedPackage;
                if ($scope.recommendedPackage) {
                    loadReviews($scope.recommendedPackage.id);
                }
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2]).then(() => LoadingService.hide());
    }

    if (SecurityService.isLoggedIn()) {
        initIfLoggedIn();
    } else {
        initIfLoggedOut();
    }

    function postcodeComparison(postcode1, postcode2) {
        return (postcode1.replace(/\s+/g, '').toUpperCase() === postcode2.replace(/\s+/g, '').toUpperCase());
    }

    $scope.openDatePicker = function($event) {
        // Need to call these, otherwise the popup won't open (a click outside
        // of the popup closes it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isDatePickerOpen = true;
    };

    $scope.$watch('pickedDate', (date, oldDate) => {
        if (typeof date === 'undefined') {
            return;
        }
        if (date === oldDate) {
            return;
        }

        if (date === null) {
            $scope.search.date = undefined;
        } else {
            // The date will be a string if the date picker was set manually.
            if (typeof date === 'string') {
                const bits = date.split(/\D/);
                $scope.search.date = new Date(bits[2], bits[1] - 1, bits[0]);
            } else {
                $scope.search.date = date;
            }
        }
    });

    $scope.submit = function() {
        if (!$scope.dashboardForm.$valid) {
            $scope.dashboardForm.$submitted = true;
            return;
        }

        SearchService.reset();

        SearchService.setDeliveryDate($scope.search.date);

        if ($scope.search.eventType) {
            SearchService.setEventTypes([$scope.search.eventType]);
        }

        SearchService.setDeliveryTime($scope.search.time);
        SearchService.setHeadCount($scope.search.headCount);

        const postcode = $scope.search.newPostcode ? $scope.search.newPostcode : $scope.search.postcode;
        SearchService.setPostcode(postcode);

        $location.path('/search');
    };
});
