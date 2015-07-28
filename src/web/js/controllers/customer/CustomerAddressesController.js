angular.module('cp.controllers.customer').controller('CustomerAddressesController',
        function($scope, CustomersFactory, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Delivery addresses');
    SecurityService.requireLoggedIn();

    CustomersFactory.getAddresses().success(function(response) {
        $scope.deliveryAddresses = response.deliveryAddresses;
        LoadingService.hide();
    });
});
