angular.module('cp.controllers.general').controller('ViewVendorController',
        function($scope, $routeParams, VendorsFactory, PackagesFactory, NotificationService, DocumentTitleService, SecurityService) {
    SecurityService.requireLoggedIn();

    const vendorId = Number($routeParams.idOrSlug.split('-')[0]);

    VendorsFactory.getVendor(vendorId)
        .success(response => {
            $scope.vendor = response;
            DocumentTitleService(response.name);
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    PackagesFactory.getPackagesByVendor(vendorId)
        .success(response => $scope.packages = response)
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));
});
