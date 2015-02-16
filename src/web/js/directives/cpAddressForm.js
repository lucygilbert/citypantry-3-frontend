angular.module('cp').directive('cpAddressForm', function() {
    return {
        restrict: 'E',
        scope: {
            address: '='
        },
        templateUrl: '/dist/templates/directives/cp-address-form.html',
        controller: function($scope, $location, AddressFactory, NotificationService, LoadingService) {
            let isNew = !$scope.address.id;

            $scope.save = function() {
                if ($scope.form.$invalid) {
                    $scope.form.$submitted = true;
                    return;
                }

                LoadingService.show();

                let promise;
                if (isNew) {
                    promise = AddressFactory.createAddress($scope.address);
                    isNew = false;
                } else {
                    promise = AddressFactory.updateAddress($scope.address.id, $scope.address);
                }

                promise.then(function() {
                    NotificationService.notifySuccess('Address saved');
                    $location.path('/vendor-portal/addresses');
                });
            };
        }
    };
});
