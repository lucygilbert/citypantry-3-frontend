angular.module('cp.controllers.vendor').controller('VendorSignUpThanksController',
        function($scope, DocumentTitleService, LoadingService) {
    DocumentTitleService('Vendor sign up');
    LoadingService.hide();
});
