angular.module('cp.controllers.vendor').controller('VendorQuickRegisterThankYouController',
        function($scope, DocumentTitleService, LoadingService) {
    DocumentTitleService('Vendor signup');
    LoadingService.hide();
});
