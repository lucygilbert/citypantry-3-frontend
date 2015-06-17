angular.module('cp.controllers.admin').controller('AdminEditOrderController',
        function($scope, $routeParams, $window, $location, OrdersFactory, NotificationService,
        addressSingleLineFormatterFilter, DocumentTitleService, SecurityService, LoadingService,
        dateIsBSTInEffectFilter) {
    DocumentTitleService('Edit Order');
    SecurityService.requireStaff();

    $scope.headCountOptions = [];
    $scope.headCount = undefined;
    $scope.messages = [];
    $scope.order = {};
    $scope.refundAmount = 0;

    OrdersFactory.getOrder($routeParams.orderId)
        .success(function(order) {
            $scope.order = order;
            $scope.headCountOptions = OrdersFactory.getHeadCountOptions($scope.order.package.maxPeople, $scope.order.package.minPeople);
            $scope.headCount = $scope.order.headCount;

            if ($scope.order.pickupAddress !== null) {
                $scope.order.pickupAddressString = addressSingleLineFormatterFilter($scope.order.pickupAddress);
            }

            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    OrdersFactory.getOrderMessages($routeParams.orderId)
        .success(response => $scope.messages = response.messages)
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    OrdersFactory.getOrderReviews($routeParams.orderId)
        .success(response => $scope.review = response.review)
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.save = function() {
        LoadingService.show();

        const updatedOrder = {
            requestedDeliveryDate: $scope.order.requestedDeliveryDate,
            pickupDate: $scope.order.pickupDate,
            cityPantryCommission: $scope.order.cityPantryCommission,
            headCount: $scope.headCount,
            dietaryRequirements: $scope.order.dietaryRequirements.getStructuredForApiCall(),
            deliveryInstruction: $scope.order.deliveryInstruction
        };

        OrdersFactory.updateOrder($routeParams.orderId, updatedOrder)
            .success(response => {
                $scope.order = response.order;
                NotificationService.notifySuccess('The order has been edited.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.saveNotes = function() {
        LoadingService.show();

        const updatedOrder = {
            cityPantryNotes: $scope.order.cityPantryNotes
        };

        OrdersFactory.updateOrder($routeParams.orderId, updatedOrder)
            .success(response => {
                $scope.order = response.order;
                NotificationService.notifySuccess('Your notes have been saved.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.addCustomerServiceEvent = event => {
        LoadingService.show();

        OrdersFactory.addCustomerServiceEvent($routeParams.orderId, event)
            .success(response => {
                $scope.order = response.order;
                NotificationService.notifySuccess('Customer service event has been recorded.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.delete = () => {
        const confirmed = $window.confirm('Are you sure?');
        if (!confirmed) {
            return;
        }

        let reason = '';
        while (reason === '') {
            reason = $window.prompt('Enter a reason for deleting the order (required)');
        }

        LoadingService.show();

        OrdersFactory.deleteOrder($routeParams.orderId, reason)
            .then(() => $location.path('/admin/orders'))
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.refund = () => {
        if (!$scope.refundOrderForm.$valid) {
            $scope.refundOrderForm.$submitted = true;
            return;
        }

        LoadingService.show();

        const refundDetails = {
            refundAmount: $scope.refundAmount,
            refundReason: $scope.refundReason,
        };

        OrdersFactory.refundOrder($routeParams.orderId, refundDetails)
            .success(response => {
                $scope.order = response.order;
                NotificationService.notifySuccess('Order has been refunded £' + $scope.refundAmount + '.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
