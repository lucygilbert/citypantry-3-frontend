angular.module('cp.controllers.general').controller('VendorPortalAddressesController',
        function ($scope, VendorsFactory, LoadingService, DocumentTitleService) {
    DocumentTitleService('Your addresses');

    VendorsFactory.getAddresses().success(function(response) {
        $scope.addresses = response.addresses;
        LoadingService.hide();
    });
});
