angular.module('cp.controllers.general').controller('CheckoutDeliveryDetailsController',
        function($scope, DocumentTitleService, SecurityService, LoadingService, PackagesFactory,
        CheckoutService, $location, NotificationService, AddressFactory, $q) {
    DocumentTitleService('Checkout: Delivery Details');
    SecurityService.requireLoggedIn();

    $scope.order = {
        packageId: CheckoutService.getPackageId(),
        postcode: CheckoutService.getPostcode()
    };

    $scope.deliveryAddresses = [];
    $scope.deliveryAddress = {countryName: 'United Kingdom'};
    $scope.forms = {};
    $scope.isNewDeliveryAddress = true;
    $scope.package = {};

    function init() {
        const promise1 = PackagesFactory.getPackage($scope.order.packageId)
            .success(response => {
                $scope.package = response;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise2 = AddressFactory.getAddresses()
            .success(response => $scope.deliveryAddresses = response.deliveryAddresses)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2]).then(() => {
            $scope.deliveryAddresses.forEach(deliveryAddress => {
                if (arePostcodesEqual($scope.order.postcode, deliveryAddress.postcode)) {
                    $scope.deliveryAddress = deliveryAddress;
                    $scope.isNewDeliveryAddress = false;
                    return false;
                }
            });

            if ($scope.isNewDeliveryAddress) {
                $scope.deliveryAddress.postcode = $scope.order.postcode;
            }

            LoadingService.hide();
        });
    }

    init();

    function arePostcodesEqual(postcode1, postcode2) {
        return (postcode1.replace(/\s+/g, '').toUpperCase() === postcode2.replace(/\s+/g, '').toUpperCase());
    }

    function setLabel() {
        $scope.deliveryAddress.label = ($scope.deliveryAddress.label ? $scope.deliveryAddress.label : $scope.deliveryAddress.addressLine1);
    }

    $scope.nextStep = function() {
        if ($scope.forms.checkoutForm && $scope.forms.checkoutForm.$invalid) {
            $scope.forms.checkoutForm.$submitted = true;
            return;
        }

        LoadingService.show();

        setLabel();

        let promise;

        if ($scope.isNewDeliveryAddress) {
            promise = AddressFactory.createAddress($scope.deliveryAddress);
        } else {
            promise = AddressFactory.updateAddress($scope.deliveryAddress.id, $scope.deliveryAddress);
        }

        promise.then(response => {
            $scope.deliveryAddress = $scope.isNewDeliveryAddress ? response.data.newAddress : response.data.updatedAddress;
            CheckoutService.setDeliveryAddressId($scope.deliveryAddress.id);
            $location.path('/checkout/payment');
        }).catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
