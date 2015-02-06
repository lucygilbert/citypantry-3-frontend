angular.module('cp.controllers.admin').controller('AdminEditPackageController',
        function($scope, $routeParams, PackagesFactory, NotificationService, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Edit Package');
    SecurityService.requireStaff();

    PackagesFactory.getPackage($routeParams.packageId)
        .success(vendorPackage => {
            $scope.vendorPackage = vendorPackage;
            LoadingService.hide();
        });

    $scope.save = function() {
        LoadingService.show();

        const updatedPackage = {
            name: $scope.vendorPackage.name,
            shortDescription: $scope.vendorPackage.shortDescription,
            description: $scope.vendorPackage.description,
        };

        PackagesFactory.updatePackage($routeParams.packageId, updatedPackage)
            .success(() => {
                NotificationService.notifySuccess('The package has been edited.');
                LoadingService.hide();
            })
            .catch((response) => NotificationService.notifyError(response.data.errorTranslation));
    };
});