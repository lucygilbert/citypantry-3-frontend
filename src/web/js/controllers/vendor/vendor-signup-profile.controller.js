angular.module('cp.controllers.vendor').controller('VendorSignUpProfileController',
        function($scope, DocumentTitleService, LoadingService) {
    DocumentTitleService('Vendor sign up');
    LoadingService.hide();

    $scope.vendor = {
        maxPeople: 1
    }
});
