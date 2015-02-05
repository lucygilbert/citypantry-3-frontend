angular.module('cp.controllers.admin').controller('AdminEditCustomerController',
        function($scope, $routeParams, CustomersFactory, NotificationService, DocumentTitleService, SecurityService) {
    DocumentTitleService('Edit Customer');
    SecurityService.requireStaff();

    CustomersFactory.getCustomer($routeParams.customerId)
        .success(customer => $scope.customer = customer)
        .error(() => NotificationService.notifyError());
});
