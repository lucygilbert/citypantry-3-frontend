angular.module('cp.controllers.admin').controller('AdminMealPlanSetupDeliveryDetailsController',
        function($scope, $location, $routeParams, DocumentTitleService, SecurityService, LoadingService,
        NotificationService, AddressFactory, MealPlanFactory) {
    DocumentTitleService('Delivery details');
    SecurityService.requireLoggedIn();

    $scope.preferences = {
        deliveryAddress: undefined
    };

    $scope.addresses = [];
    $scope.address = {countryName: 'United Kingdom'};
    $scope.forms = {};

    AddressFactory.getAddressesByCustomerId($routeParams.customerId)
        .success(response => {
            $scope.addresses = response.addresses;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    function setLabel() {
        $scope.address.label = ($scope.address.label ? $scope.address.label : $scope.address.addressLine1);
    }

    $scope.$watch('preferences.deliveryAddress', deliveryAddressId => {
        if (typeof deliveryAddressId === 'undefined') {
            return;
        }

        $scope.addresses.forEach(address => {
            if (deliveryAddressId === address.id) {
                $scope.address = address;
            }
        });
    });

    $scope.nextStep = () => {
        if ($scope.forms.mealPlanSetupForm && $scope.forms.mealPlanSetupForm.$invalid) {
            $scope.forms.mealPlanSetupForm.$submitted = true;
            return;
        }

        LoadingService.show();

        setLabel();

        let promise;

        if ($scope.preferences.deliveryAddress) {
            promise = AddressFactory.updateAddress($scope.address.id, $scope.address);
        } else {
            promise = AddressFactory.createAddress($scope.address, $routeParams.customerId);
        }

        promise.then(response => {
            $scope.address = $scope.preferences.deliveryAddress ? response.data.updatedAddress : response.data.newAddress;

            MealPlanFactory.setCustomerMealPlanRequirements($routeParams.customerId, {deliveryAddress: $scope.address.id})
                .success(response => {
                    $location.path(`/admin/meal-plan/customer/${$routeParams.customerId}/setup/payment`);
                })
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
        }).catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
