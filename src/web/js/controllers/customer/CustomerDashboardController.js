angular.module('cp.controllers.customer').controller('CustomerDashboardController',
        function($scope, DocumentTitleService, SecurityService, LoadingService, $q, PackagesFactory,
        OrdersFactory, $location, CustomersFactory, NotificationService, $filter, SearchService) {
    SecurityService.requireCustomer();
    DocumentTitleService('Dashboard');

    $scope.addresses = [];
    $scope.customer = {};
    $scope.headCountOptions = OrdersFactory.getHeadCountOptions(500, 1);
    $scope.isDatePickerOpen = false;
    $scope.isNewPostcode = true;
    $scope.eventTypeOptions = [];
    $scope.minDate = new Date();
    $scope.orders = [];
    $scope.nextOrder = undefined;
    $scope.timeOptions = PackagesFactory.getPackageDeliveryTimeOptions(700, 2400, 30);

    $scope.search = {
        date: SearchService.getDeliveryDate(),
        eventType: undefined,
        headCount: SearchService.getHeadCount(),
        newPostcode: undefined,
        postcode: undefined,
        time: SearchService.getDeliveryTime()
    };

    function init() {
        const promise1 = PackagesFactory.getEventTypes()
            .success(response => {
                $scope.eventTypeOptions = response.eventTypes;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise2 = CustomersFactory.getAddresses()
            .success(response => {
                $scope.addresses = response.addresses;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise3 = OrdersFactory.getOrdersByCurrentCustomer()
            .success(response => {
                $scope.customer = response.customer;
                $scope.orders = response.orders;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2, promise3]).then(() => {
            const postcode = SearchService.getPostcode();
            if (postcode) {
                $scope.addresses.forEach(address => {
                    if (postcodeComparison(postcode, address.postcode)) {
                        $scope.search.postcode = postcode;
                        $scope.isNewPostcode = false;
                        return false;
                    }
                });
                if ($scope.isNewPostcode) {
                    $scope.search.newPostcode = postcode;
                }
            } else {
                if ($scope.addresses.length > 0) {
                    $scope.search.postcode = $scope.addresses[0].postcode;
                }
            }

            const upcomingOrders = $scope.orders.filter(order => {
                    return order.statusText !== 'not_placed' && order.requestedDeliveryDate >= toIso8601String(new Date());
                })
                .sort((a, b) => a.requestedDeliveryDate > b.requestedDeliveryDate);

            if (upcomingOrders.length > 0) {
                $scope.nextOrder = upcomingOrders[0];
            }

            if ($scope.search.date) {
                $scope.pickedDate = $filter('date')($scope.search.date, 'dd/MM/yyyy');
            }

            const eventTypes = SearchService.getEventTypes();
            if (eventTypes.length > 0) {
                $scope.search.eventType = eventTypes[0];
            }

            LoadingService.hide();
        });
    }

    init();

    // @todo - This function seems pointless.
    function toIso8601String(date) {
        const off = date.getTimezoneOffset();

        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() - off, date.getSeconds(), date.getMilliseconds()).toISOString();
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
