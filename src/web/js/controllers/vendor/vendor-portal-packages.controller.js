angular.module('cp.controllers.vendor').controller('VendorPortalPackagesController',
        function ($scope, $cookies, $window, DocumentTitleService, LoadingService, NotificationService,
        SecurityService, PackagesFactory, getVendorStatusTextFilter) {
    SecurityService.requireVendor();
    DocumentTitleService('Your packages');

    $scope.count = 0;
    $scope.packages = [];

    function loadPackages() {
        // todo – replace getPackagesByVendor() with getPackagesByCurrentVendor()
        PackagesFactory.getPackagesByVendor($cookies.vendorId)
            .success(response => {
                angular.forEach(response.packages, row => row.activeAndApproved = getVendorStatusTextFilter(row.active, row.approved));
                $scope.packages = response.packages;
                $scope.count = $scope.packages.length;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    loadPackages();

    $scope.delete = function(id) {
        const confirmed = $window.confirm('Are you sure?');
        if (confirmed) {
            LoadingService.show();
            PackagesFactory.deletePackage(id)
                .then(loadPackages)
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
        }
    };
});
