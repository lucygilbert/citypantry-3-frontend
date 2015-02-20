angular.module('cp.controllers.vendor').controller('VendorSignupAgreementController',
        function($scope, $cookies, $window, DocumentTitleService, LoadingService, VendorsFactory) {
    DocumentTitleService('Vendor signup');
    LoadingService.hide();

    $scope.submit = function() {
        LoadingService.show();

        $scope.vendorSignUpFormError = null;

        const updatedVendor = {
            isActive: true
        };

        VendorsFactory.updateVendor($cookies.vendorId, updatedVendor)
            .success(response => {
                $window.location = '/vendor/signup/thanks';
            })
            .catch(response => {
                $scope.vendorSignUpFormError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
