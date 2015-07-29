angular.module('cp.controllers.customer').controller('CustomerAddressController', function ($scope,
        $routeParams, CustomersFactory, LoadingService, DocumentTitleService, NotificationService) {
    DocumentTitleService('Address');

    const id = $routeParams.id;
    const type = $routeParams.type;
    const isDelivery = type === 'delivery';
    const isBilling = type === 'billing';

    $scope.isDelivery = isDelivery;
    $scope.type = type;

    if (id) {
        const factoryMethod = isDelivery ? 'getDeliveryAddressById' : 'getBillingAddressById';
        CustomersFactory[factoryMethod](id)
            .then(function(address) {
                $scope.address = address;
                $scope.isNew = false;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    } else {
        $scope.address = {countryName: 'United Kingdom'};
        $scope.isNew = true;
        LoadingService.hide();
    }
});
