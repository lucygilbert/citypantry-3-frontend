angular.module('cp.controllers.customer').controller('CustomerAddressesController',
        function($scope, CustomersFactory, DocumentTitleService, SecurityService, LoadingService,
        NotificationService) {
    DocumentTitleService('Delivery and billing addresses');
    SecurityService.requireLoggedIn();

    CustomersFactory.getAddresses()
        .success(function(response) {
            $scope.deliveryAddresses = response.deliveryAddresses;
            $scope.billingAddresses = response.billingAddresses;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));
});
