angular.module('cp').directive('cpAddressForm', function(SecurityService, getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            address: '=',
            addressType: '=',
        },
        templateUrl: getTemplateUrl('directives/cp-address-form.html'),
        controller: 'cpAddressFormController'
    };
});

angular.module('cp').controller('cpAddressFormController', function($scope, $location,
        AddressFactory, NotificationService, LoadingService, SecurityService, getTemplateUrl) {
    const validAddressTypes = ['vendor', 'delivery', 'billing'];
    if (validAddressTypes.indexOf($scope.addressType) === -1) {
        throw new Error('addressType must be one of: ' + validAddressTypes.join(', '));
    }

    $scope.formTemplate = getTemplateUrl('directives/cp-address-form-for-' + $scope.addressType + '.html');

    if ($scope.addressType === 'vendor') {
        if (!$scope.address.orderNotificationMobileNumbers) {
            $scope.address.orderNotificationMobileNumbers = [];
        }
        $scope.address.orderNotificationMobileNumbersCommaSeparated = $scope.address.orderNotificationMobileNumbers.join(', ');
    }

    function setLabel() {
        $scope.address.label = ($scope.address.label ? $scope.address.label : $scope.address.addressLine1);
    }

    function redirectToAddressesPage() {
        if (SecurityService.customerIsLoggedIn()) {
            $location.path('/customer/addresses');
        } else if (SecurityService.vendorIsLoggedIn()) {
            $location.path('/vendor/addresses');
        } else {
            throw new Error('Unexpected user type.');
        }
    }

    $scope.isNew = !$scope.address.id;

    setLabel();

    $scope.save = function() {
        if ($scope.form.$invalid) {
            $scope.form.$submitted = true;
            return;
        }

        if ($scope.addressType === 'vendor') {
            $scope.address.orderNotificationMobileNumbers = $scope.address.orderNotificationMobileNumbersCommaSeparated.split(/\s*,\s*/);
        }

        LoadingService.show();

        setLabel();

        let promise;
        if ($scope.isNew) {
            const factoryMethod = $scope.addressType === 'billing' ? 'createBillingAddress' : 'createAddress';
            promise = AddressFactory[factoryMethod]($scope.address)
                .then(response => {
                    $scope.isNew = false;
                    return response;
                });
        } else {
            promise = AddressFactory.updateAddress($scope.address.id, $scope.address);
        }

        promise
            .then(redirectToAddressesPage)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.cancel = () => redirectToAddressesPage();
});
