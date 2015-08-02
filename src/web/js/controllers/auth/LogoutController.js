angular.module('cp.controllers.authentication').controller('LogoutController', function($window,
        CheckoutService, DocumentTitleService, LoadingService) {
    DocumentTitleService('Goodbye!');
    LoadingService.hide();

    // Reset the saved checkout details, so any unused promo code entered is forgotten.
    CheckoutService.reset();

    $window.location = '/logout';
});
