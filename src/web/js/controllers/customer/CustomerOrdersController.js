angular.module('cp.controllers.customer').controller('CustomerOrdersController',
        function($scope, $window, OrdersFactory, NotificationService, DocumentTitleService, SecurityService, LoadingService) {
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

    $scope.downloadInvoice = function(order) {
        LoadingService.show();

        OrdersFactory.getOrderInvoices(order.id)
            .success(response => {
                if (response.invoices.length === 0) {
                    NotificationService.notifyError('The invoice for this order is not available to download.');
                    return;
                }

                const firstInvoice = response.invoices[response.invoices.length - 1];

                if (!firstInvoice.fileSystemUrl) {
                    NotificationService.notifyError('The invoice for this order is not available to download.');
                    return;
                }

                $window.location = firstInvoice.fileSystemUrl;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
