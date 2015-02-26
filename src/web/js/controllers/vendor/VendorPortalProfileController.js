angular.module('cp.controllers.vendor').controller('VendorPortalProfileController',
        function($scope, $cookies, DocumentTitleService, LoadingService, SecurityService, VendorsFactory) {
    SecurityService.requireVendor();
    DocumentTitleService('Edit profile');

    $scope.vendor = {};

    SecurityService.getVendor().then(vendor => {
        $scope.vendor = vendor;
        LoadingService.hide();
    });
});
