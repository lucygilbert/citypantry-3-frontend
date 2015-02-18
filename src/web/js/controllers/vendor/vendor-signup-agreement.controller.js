angular.module('cp.controllers.general').controller('VendorSignUpAgreementController',
        function($scope, $window, DocumentTitleService, LoadingService, VendorsFactory) {
    DocumentTitleService('Vendor sign up');
    LoadingService.hide();

    $scope.signUp = function() {
        LoadingService.show();

        $scope.signUpError = null;

        const updatedVendor = {
            isActive: true
        };

        VendorsFactory.updateVendor($cookies.vendorId, updatedVendor)
            .success(response => {
                $window.location = '/vendor/signup/thanks';
            })
            .catch(response => {
                $scope.signUpError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
