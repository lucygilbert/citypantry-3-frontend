angular.module('cp.controllers.admin').controller('AdminEditPackagesController',
        function($scope, PackagesFactory, NotificationService, DocumentTitleService, SecurityService,
        LoadingService) {
    SecurityService.requireStaff();

    $scope.packagingTypes = PackagesFactory.getPackagingTypeOptions();

    PackagesFactory.getAllPackages()
        .success(response => {
            $scope.packages = response.packages.sort((a, b) => a.name.localeCompare(b.name));
            LoadingService.hide();
            DocumentTitleService('Edit packages');
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.save = function(pkg) {
        if (!pkg.hasChanged) {
            return;
        }

        LoadingService.show();

        const updatedPackage = {
            name: pkg.name,
            isMealPlan: pkg.isMealPlan,
            packagingType: pkg.packagingType,
            canDeliverCutleryAndServiettes: pkg.canDeliverCutleryAndServiettes
        };
        PackagesFactory.updatePackage(pkg.id, updatedPackage)
            .success(response => {
                pkg.hasChanged = false;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
