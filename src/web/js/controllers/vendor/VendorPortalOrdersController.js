angular.module('cp.controllers.general').controller('VendorPortalOrdersController',
        function($scope, OrdersFactory, NotificationService, DocumentTitleService, SecurityService, LoadingService) {
    SecurityService.requireVendor();
    DocumentTitleService('Your orders');

    OrdersFactory.getOrdersByCurrentVendor()
        .success(response => {
            $scope.count = response.count;
            $scope.orders = response.orders;
            $scope.vendor = response.vendor;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.acceptOrder = function(order) {
        // @todo
    };

    $scope.showReceipt = function(order) {
        $scope.modal = true;
        $scope.modalOrder = order;
    };
});
