angular.module('cp.controllers.admin').controller('AdminEditCustomerController',
        function($scope, $routeParams, CustomersFactory, NotificationService, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Edit Customer');
    SecurityService.requireStaff();

    CustomersFactory.getCustomer($routeParams.customerId)
        .success(customer => {
            $scope.customer = customer;
            LoadingService.hide();
        })
        .error(() => NotificationService.notifyError());
});
