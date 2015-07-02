angular.module('cp.controllers.team', []);

angular.module('cp.controllers.team').controller('TeamMenuController', function($scope, $routeParams,
        OrdersFactory, DocumentTitleService, LoadingService, NotificationService) {
    DocumentTitleService('Your company\'s menu');

    const customerId = $routeParams.customerId;
    $scope.customerId = customerId;

    OrdersFactory.getCustomerTeamOrders(customerId)
        .success(response => {
            // Only show orders that have been delivered or are to be delivered within the
            // next 24 hours.
            const nowTimestamp = Date.now();
            const showOrdersUntilTimestamp = nowTimestamp + 86400000;
            $scope.orders = response.orders.filter(order => {
                const deliveryTimestamp = parseIso8601(order.requestedDeliveryDate);
                return (deliveryTimestamp < showOrdersUntilTimestamp);
            });

            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));
});
