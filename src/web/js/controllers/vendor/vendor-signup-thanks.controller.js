angular.module('cp.controllers.general').controller('VendorSignUpThanksController',
        function($scope, DocumentTitleService, LoadingService) {
    DocumentTitleService('Vendor sign up');
    LoadingService.hide();
});
