angular.module('cp.controllers.vendor').controller('VendorSignupAgreementController',
        function($scope, $cookies, $window, DocumentTitleService, LoadingService, VendorsFactory) {
    DocumentTitleService('Vendor signup');
    LoadingService.hide();

    $scope.submit = function() {
        LoadingService.show();

        $scope.vendorSignupFormError = null;

        const updatedVendor = {
            isActive: true
        };

        VendorsFactory.updateVendor($cookies.vendorId, updatedVendor)
            .success(response => {
                $window.location = '/vendor/signup/thanks';
            })
            .catch(response => {
                $scope.vendorSignupFormError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
