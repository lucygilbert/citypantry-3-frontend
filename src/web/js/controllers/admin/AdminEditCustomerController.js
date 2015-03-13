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

    $scope.approveRequestToPayOnAccount = function() {
        LoadingService.show();

        CustomersFactory.approveRequestToPayOnAccount($routeParams.customerId)
            .success(response => {
                $scope.customer = response.customer;
                NotificationService.notifySuccess('The request to pay on account has been approved.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.rejectRequestToPayOnAccount = function() {
        LoadingService.show();

        CustomersFactory.rejectRequestToPayOnAccount($routeParams.customerId)
            .success(response => {
                $scope.customer = response.customer;
                NotificationService.notifySuccess('The request to pay on account has been rejected.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.revokePaymentOnAccount = function() {
        LoadingService.show();

        CustomersFactory.revokePaymentOnAccount($routeParams.customerId)
            .success(response => {
                $scope.customer = response.customer;
                NotificationService.notifySuccess('Payment on account has been revoked.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
