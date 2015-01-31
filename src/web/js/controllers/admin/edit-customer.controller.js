angular.module('cp.controllers.admin').controller('AdminEditCustomerController',
        function($scope, $routeParams, CustomersFactory, NotificationService) {
    CustomersFactory.getCustomer($routeParams.customerId)
        .success(customer => $scope.customer = customer)
        .error(() => NotificationService.notifyError());
});
