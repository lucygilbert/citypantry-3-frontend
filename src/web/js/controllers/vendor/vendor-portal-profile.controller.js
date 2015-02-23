angular.module('cp.controllers.vendor').controller('VendorPortalProfileController',
        function($scope, $cookies, DocumentTitleService, LoadingService, SecurityService, VendorsFactory) {
    SecurityService.requireVendor();

    $scope.vendor = {};

    VendorsFactory.getVendor($cookies.vendorId).then(response => {
        $scope.vendor = response;
        DocumentTitleService('Edit profile');
        LoadingService.hide();
    });
});
