angular.module('cp.controllers.customer').controller('CustomerOrdersController',
        function($scope, OrdersFactory, NotificationService, DocumentTitleService, SecurityService, LoadingService) {
    SecurityService.requireCustomer();
    DocumentTitleService('Your orders');

    function loadOrders() {
        OrdersFactory.getOrdersByCurrentCustomer()
            .success(response => {
                $scope.customer = response.customer;
                // Only orders that are active or pending vendor approval should be visible on this page.
                $scope.orders = response.orders.filter(order => order.statusText !== 'not_placed')
                    .sort((a, b) => a.humanId > b.humanId)
                    .reverse();
                $scope.count = $scope.orders.length;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    loadOrders();

    $scope.showReceipt = function(order) {
        $scope.modal = true;
        $scope.modalOrder = order;
    };
});
