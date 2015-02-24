angular.module('cp.controllers.vendor').controller('VendorSignupAgreementController',
        function($scope, $cookies, $location, DocumentTitleService, LoadingService, VendorsFactory) {
    DocumentTitleService('Vendor signup');
    LoadingService.hide();

    $scope.submit = function() {
        LoadingService.show();

        $scope.vendorSignupFormError = null;

        const updatedVendor = {
            isActive: true
        };

        VendorsFactory.updateSelf(updatedVendor)
            .success(response => {
                $location.path('/vendor/signup/thanks');
            })
            .catch(response => {
                $scope.vendorSignupFormError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
