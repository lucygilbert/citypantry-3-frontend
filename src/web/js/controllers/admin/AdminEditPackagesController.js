angular.module('cp.controllers.admin').controller('AdminEditPackagesController',
        function($scope, PackagesFactory, NotificationService, DocumentTitleService, SecurityService,
        LoadingService, $q) {
    SecurityService.requireStaff();
    DocumentTitleService('Edit packages');

    $scope.packagingTypes = PackagesFactory.getPackagingTypeOptions();

    $scope.noticeOptions = PackagesFactory.getNoticeOptions();

    const loadingPromise1 = PackagesFactory.getCuisineTypes()
        .success(response => $scope.cuisineTypes = response.cuisineTypes)
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    const loadingPromise2 = PackagesFactory.getAllPackages()
        .success(response => {
            $scope.packages = response.packages.sort((a, b) => a.name.localeCompare(b.name));
            $scope.packages.forEach(pkg => pkg.cuisineTypeId = (pkg.cuisineType ? pkg.cuisineType.id : null));
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    $q.all([loadingPromise1, loadingPromise2]).then(() => LoadingService.hide());

    $scope.save = function(pkg) {
        if (!pkg.hasChanged) {
            return;
        }

        LoadingService.show();

        const updatedPackage = {
            name: pkg.name,
            isMealPlan: pkg.isMealPlan,
            packagingType: pkg.packagingType,
            canDeliverCutleryAndServiettes: pkg.canDeliverCutleryAndServiettes,
            notice: pkg.notice,
            cuisineType: pkg.cuisineTypeId
        };
        PackagesFactory.updatePackage(pkg.id, updatedPackage)
            .success(response => {
                pkg.hasChanged = false;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
