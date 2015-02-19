angular.module('cp.controllers.vendor').controller('VendorSignUpAgreementController',
        function($scope, $cookies, $window, DocumentTitleService, LoadingService, VendorsFactory) {
    DocumentTitleService('Vendor sign up');
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
