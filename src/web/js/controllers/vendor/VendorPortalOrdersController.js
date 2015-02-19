angular.module('cp.controllers.general').controller('VendorPortalOrdersController',
        function($scope, OrdersFactory, NotificationService, DocumentTitleService, SecurityService, LoadingService) {
    SecurityService.requireVendor();
    DocumentTitleService('Your orders');

    function loadOrders() {
        OrdersFactory.getOrdersByCurrentVendor()
            .success(response => {
                $scope.vendor = response.vendor;
                // Only orders that are active and pending vendor approval should be visible on this page.
                $scope.orders = response.orders.filter(order => order.statusText !== 'not_placed')
                    .sort((a, b) => a.humanId > b.humanId)
                    .reverse();
                $scope.count = $scope.orders.length;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    loadOrders();

    $scope.acceptOrder = function(order) {
        LoadingService.show();
        $scope.modal = false;

        OrdersFactory.acceptOrder(order.id)
            .success(loadOrders)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.showReceipt = function(order) {
        $scope.modal = true;
        $scope.modalOrder = order;
    };
});
