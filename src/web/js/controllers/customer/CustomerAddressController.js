angular.module('cp.controllers.customer').controller('CustomerAddressController',
        function ($scope, $routeParams, CustomersFactory, LoadingService, DocumentTitleService) {
    DocumentTitleService('Delivery address');

    if ($routeParams.id) {
        CustomersFactory.getAddressById($routeParams.id).then(function(address) {
            $scope.address = address;
            $scope.isNew = false;
            LoadingService.hide();
        });
    } else {
        $scope.address = {countryName: 'United Kingdom'};
        $scope.isNew = true;
        LoadingService.hide();
    }
});
