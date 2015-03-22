angular.module('cp.controllers.admin').controller('AdminEditVendorsController',
        function($scope, VendorsFactory, NotificationService, DocumentTitleService, SecurityService,
        LoadingService) {
    SecurityService.requireStaff();

    VendorsFactory.getAllVendors()
        .success(response => {
            $scope.vendors = response.vendors.sort((a, b) => a.name.localeCompare(b.name));
            LoadingService.hide();
            DocumentTitleService('Edit vendors');
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.save = function(vendor) {
        if (!vendor.hasChanged) {
            return;
        }

        LoadingService.show();

        const updatedVendor = {
            name: vendor.name,
            isMealPlan: vendor.isMealPlan,
            misspellings: String(vendor.misspellings).split(/, ?/g)
        };
        VendorsFactory.updateVendor(vendor.id, updatedVendor)
            .success(response => {
                vendor.hasChanged = false;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
