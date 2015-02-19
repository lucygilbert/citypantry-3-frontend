angular.module('cp.controllers.general').controller('VendorPortalOrderMessagesController',
        function($scope, $routeParams, $q, OrdersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService) {
    SecurityService.requireVendor();

    function loadOrder() {
        let promise1 = OrdersFactory.getOrder($routeParams.id)
            .success(response => $scope.order = response)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        let promise2 = OrdersFactory.getOrderMessages($routeParams.id)
            .success(response => $scope.messages = response.messages)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2]).then(() => {
            LoadingService.hide();
            DocumentTitleService('Order ' + $scope.order.humanId);
        });
    }

    loadOrder();

    $scope.sendMessage = function() {
        LoadingService.show();
        $scope.message = null;

        OrdersFactory.sendMessage($routeParams.id, $scope.message)
            .success(loadOrder)
            .error(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
