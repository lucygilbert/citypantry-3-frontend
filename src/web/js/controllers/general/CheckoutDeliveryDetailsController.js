angular.module('cp.controllers.general').controller('CheckoutDeliveryDetailsController',
        function($scope, DocumentTitleService, SecurityService, LoadingService, PackagesFactory,
        CheckoutService, $location, NotificationService, AddressFactory, $q) {
    DocumentTitleService('Checkout: Delivery Details');
    SecurityService.requireLoggedIn();

    $scope.order = {
        packageId: CheckoutService.getPackageId(),
        postcode: CheckoutService.getPostcode()
    };

    $scope.addresses = [];
    $scope.address = {countryName: 'United Kingdom'};
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
            .success(response => {
                $scope.addresses = response.addresses;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2]).then(() => {
            $scope.addresses.forEach(address => {
                if (postcodeComparison($scope.order.postcode, address.postcode)) {
                    $scope.address = address;
                    $scope.isNewDeliveryAddress = false;
                    return false;
                }
            });

            if ($scope.isNewDeliveryAddress) {
                $scope.address.postcode = $scope.order.postcode;
            }

            LoadingService.hide();
        });
    }

    init();

    function postcodeComparison(postcode1, postcode2) {
        return (postcode1.replace(/\s+/g, '').toUpperCase() === postcode2.replace(/\s+/g, '').toUpperCase());
    }

    function setLabel() {
        $scope.address.label = ($scope.address.label ? $scope.address.label : $scope.address.addressLine1);
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
            promise = AddressFactory.createAddress($scope.address);
        } else {
            promise = AddressFactory.updateAddress($scope.address.id, $scope.address);
        }

        promise.then(response => {
            $scope.address = $scope.isNewDeliveryAddress ? response.data.newAddress : response.data.updatedAddress;
            CheckoutService.setDeliveryAddressId($scope.address.id);
            $location.path('/checkout/payment');
        }).catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
