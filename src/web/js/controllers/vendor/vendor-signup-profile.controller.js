angular.module('cp.controllers.vendor').controller('VendorSignupProfileController',
        function($scope, DocumentTitleService, LoadingService) {
    DocumentTitleService('Vendor signup');
    LoadingService.hide();

    $scope.vendor = {
        maxPeople: 1
    };
});
