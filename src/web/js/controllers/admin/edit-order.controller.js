angular.module('cp.controllers.admin').controller('AdminEditOrderController',
        function($scope, $routeParams, OrdersFactory, NotificationService) {
    OrdersFactory.getOrder($routeParams.orderId)
        .success(order => $scope.order = order)
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    OrdersFactory.getOrderMessages($routeParams.orderId)
        .success(response => $scope.messages = response.messages)
        .error(response => NotificationService.notifyError(response.data.errorTranslation));
});
