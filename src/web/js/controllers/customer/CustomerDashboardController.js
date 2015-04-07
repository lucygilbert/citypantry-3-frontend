angular.module('cp.controllers.customer').controller('CustomerDashboardController',
        function($scope, DocumentTitleService, SecurityService, LoadingService, $q, PackagesFactory,
        OrdersFactory, $location, CustomersFactory) {
    SecurityService.requireCustomer();
    DocumentTitleService('Dashboard');

    $scope.addresses = [];
    $scope.customer = {};
    $scope.headCountOptions = OrdersFactory.getHeadCountOptions(500, 1);
    $scope.isDatePickerOpen = false;
    $scope.eventTypeOptions = [];
    $scope.minDate = new Date();
    $scope.orders = [];
    $scope.nextOrder = undefined;
    $scope.timeOptions = PackagesFactory.getDeliveryTimeOptions();

    $scope.search = {
        date: undefined,
        eventType: undefined,
        headCount: undefined,
        newPostcode: undefined,
        postcode: undefined,
        time: undefined
    };

    function init() {
        const promise1 = PackagesFactory.getEventTypes()
            .success(response => {
                $scope.eventTypeOptions = response.eventTypes;
            });

        const promise2 = CustomersFactory.getAddresses()
            .success(response => {
                $scope.addresses = response.addresses;
            });

        const promise3 = OrdersFactory.getOrdersByCurrentCustomer()
            .success(response => {
                $scope.customer = response.customer;
                $scope.orders = response.orders;
            });

        $q.all([promise1, promise2, promise3]).then(() => {
            if ($scope.addresses.length > 0) {
                $scope.search.postcode = $scope.addresses[0].postcode;
            }

            const upcomingOrders = $scope.orders.filter(order => {
                    return order.statusText !== 'not_placed' && order.requestedDeliveryDate >= toIso8601String(new Date());
                })
                .sort((a, b) => a.requestedDeliveryDate > b.requestedDeliveryDate);

            if (upcomingOrders.length > 0) {
                $scope.nextOrder = upcomingOrders[0];
            }

            LoadingService.hide()
        });
    }

    init();

    function toIso8601String(date) {
        const off = date.getTimezoneOffset();

        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() - off, date.getSeconds(), date.getMilliseconds()).toISOString();
    }

    $scope.openDatePicker = function($event) {
        // Need to call these, otherwise the popup won't open (a click outside
        // of the popup closes it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isDatePickerOpen = true;
    };

    $scope.submit = function() {
        if (!$scope.dashboardForm.$valid) {
            $scope.dashboardForm.$submitted = true;
            return;
        }

        if ($scope.search.date) {
            var date = $scope.search.date.getFullYear() + '-' + ($scope.search.date.getMonth() + 1) + '-' + $scope.search.date.getDate();
        }

        const urlParams = {
            postcode: $scope.search.newPostcode ? $scope.search.newPostcode : $scope.search.postcode,
            headCount: $scope.search.headCount,
            time: $scope.search.time,
            date: date ? date : undefined,
            eventTypeId: $scope.search.eventType
        };

        $location.path('/search').search(urlParams);
    };
});
