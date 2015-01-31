angular.module('cp.controllers.admin').controller('AdminEditOrderController',
        function($scope, $routeParams, OrdersFactory, NotificationService) {
    OrdersFactory.getOrder($routeParams.orderId)
        .success(order => $scope.order = order)
        .error(() => NotificationService.notifyError());
});
