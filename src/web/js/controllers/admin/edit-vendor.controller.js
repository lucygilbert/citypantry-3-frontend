angular.module('cp.controllers.admin').controller('AdminEditVendorController',
        function($scope, $routeParams, VendorsFactory, NotificationService, DocumentTitleService, SecurityService) {
    DocumentTitleService('Edit Vendor');
    SecurityService.requireStaff();

    $scope.vendor = {};

    VendorsFactory.getVendor($routeParams.vendorId).
        success(vendor => $scope.vendor = vendor);

    $scope.save = function() {
        var misspellings = String($scope.vendor.misspellings).split(/, ?/g);
        var updatedVendor = {
            description: $scope.vendor.description,
            misspellings: misspellings
        };
        VendorsFactory.updateVendor($routeParams.vendorId, updatedVendor)
            .success(() => NotificationService.notifySuccess('The vendor has been edited.'))
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
