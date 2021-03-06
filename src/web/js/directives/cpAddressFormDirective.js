angular.module('cp').directive('cpAddressForm', function(SecurityService, getTemplateUrl) {
    const template = getTemplateUrl('directives/cp-address-form-for-' +
        (SecurityService.customerIsLoggedIn() ? 'customer' : 'vendor') +
        '.html');

    return {
        restrict: 'E',
        scope: {
            address: '=',
            userType: '=',
        },
        templateUrl: template,
        controller: function($scope, $location, AddressFactory, NotificationService, LoadingService, SecurityService) {
            if ($scope.userType !== 'vendor' && $scope.userType !== 'customer') {
                throw new Error('userType must be vendor or customer');
            }

            function setLabel() {
                $scope.address.label = ($scope.address.label ? $scope.address.label : $scope.address.addressLine1);
            }

            let isNew = !$scope.address.id;
            $scope.isNew = isNew;

            setLabel();

            $scope.save = function() {
                if ($scope.form.$invalid) {
                    $scope.form.$submitted = true;
                    return;
                }

                LoadingService.show();

                setLabel();

                let promise;
                if (isNew) {
                    promise = AddressFactory.createAddress($scope.address);
                    isNew = false;
                    $scope.isNew = false;
                } else {
                    promise = AddressFactory.updateAddress($scope.address.id, $scope.address);
                }

                promise.then(function() {
                    const redirectTo = '/' + $scope.userType + '/addresses';
                    $location.path(redirectTo);
                });
            };

            $scope.cancel = function() {
                if (SecurityService.customerIsLoggedIn()) {
                    $location.path('/customer/addresses');
                } else if (SecurityService.vendorIsLoggedIn()) {
                    $location.path('/vendor/addresses');
                } else {
                    throw new Error('Unexpected user type.');
                }
            };
        }
    };
});
