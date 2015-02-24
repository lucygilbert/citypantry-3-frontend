angular.module('cp.controllers.admin').controller('AdminEditVendorController',
        function($scope, $routeParams, VendorsFactory, NotificationService, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Edit Vendor');
    SecurityService.requireStaff();

    $scope.vendor = {};

    VendorsFactory.getVendor($routeParams.vendorId).
        success(vendor => {
            $scope.vendor = vendor;
            LoadingService.hide();
        });

    $scope.save = function() {
        LoadingService.show();

        const misspellings = String($scope.vendor.misspellings).split(/, ?/g);
        const updatedVendor = {
            description: $scope.vendor.description,
            cityPantryCommission: $scope.vendor.cityPantryCommission,
            misspellings: misspellings
        };
        VendorsFactory.updateVendor($routeParams.vendorId, updatedVendor)
            .success(response => {
                $scope.vendor = response.updatedObject;
                NotificationService.notifySuccess('The vendor has been edited.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
