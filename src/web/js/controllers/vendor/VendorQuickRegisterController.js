angular.module('cp.controllers.vendor').controller('VendorQuickRegisterController',
        function ($scope, $location, DocumentTitleService, LoadingService, NotificationService, UsersFactory) {
    DocumentTitleService('Vendor signup');
    LoadingService.hide();

    $scope.signupDetails = {};

    $scope.submitSignupForm = () => {
        if ($scope.vendorSignupForm.$invalid) {
            return;
        }

        LoadingService.show();

        UsersFactory.registerVendor($scope.signupDetails)
            .success(response => $location.path('/vendor/quick-register/thank-you'))
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
