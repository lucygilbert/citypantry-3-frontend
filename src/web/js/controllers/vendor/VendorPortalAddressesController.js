angular.module('cp.controllers.general').controller('VendorPortalAddressesController',
        function ($scope, AddressFactory, VendorsFactory, LoadingService, DocumentTitleService, NotificationService) {
    DocumentTitleService('Your addresses');

    function loadAddresses() {
        VendorsFactory.getAddresses().success(response => {
            $scope.addresses = response.addresses;
            LoadingService.hide();
        });
    }

    loadAddresses();

    $scope.deleteAddress = address => {
        LoadingService.show();

        AddressFactory.deleteAddress(address.id)
            .success(() => {
                NotificationService.notifySuccess('Address deleted.');
                loadAddresses();
            })
            .catch(response => {
                NotificationService.notifyError(response.data.errorTranslation);
                LoadingService.hide();
            });
    };
});
