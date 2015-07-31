angular.module('cp.controllers.customer').controller('CustomerAddressesController',
        function($scope, CustomersFactory, DocumentTitleService, SecurityService, LoadingService,
        NotificationService, AddressFactory) {
    DocumentTitleService('Delivery and billing addresses');
    SecurityService.requireLoggedIn();

    function loadAddresses() {
        CustomersFactory.getAddresses()
            .success(function(response) {
                $scope.deliveryAddresses = response.deliveryAddresses;
                $scope.billingAddresses = response.billingAddresses;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    loadAddresses();

    $scope.useForInvoicesAndReceipts = (billingAddress) => {
        LoadingService.show();

        CustomersFactory.updateSelf({billingAddressForInvoicesAndReceipts: billingAddress.id})
            .then(loadAddresses)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.delete = (address) => {
        LoadingService.show();

        AddressFactory.deleteAddress(address.id)
            .then(loadAddresses)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
