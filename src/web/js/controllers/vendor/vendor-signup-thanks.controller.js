angular.module('cp.controllers.vendor').controller('VendorSignupThanksController',
        function($scope, DocumentTitleService, LoadingService) {
    DocumentTitleService('Vendor signup');
    LoadingService.hide();
});
