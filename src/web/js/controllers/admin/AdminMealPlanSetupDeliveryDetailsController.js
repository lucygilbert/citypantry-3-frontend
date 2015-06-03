angular.module('cp.controllers.admin').controller('AdminMealPlanSetupDeliveryDetailsController',
        function($scope, $q, $location, $routeParams, DocumentTitleService, SecurityService, LoadingService,
        NotificationService, AddressFactory, MealPlanFactory) {
    DocumentTitleService('Delivery details');
    SecurityService.requireLoggedIn();

    const newAddress = {countryName: 'United Kingdom'};

    $scope.chosenDeliveryAddressId = null;
    $scope.existingAddresses = [];
    $scope.newOrUpdatedAddress = angular.copy(newAddress);

    const initPromises = [];

    initPromises[0] = AddressFactory.getAddressesByCustomerId($routeParams.customerId)
        .success(response => $scope.existingAddresses = response.addresses)
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    initPromises[1] = MealPlanFactory.getCustomerMealPlanRequirements($routeParams.customerId)
        .success(response => {
            if (response.requirements.deliveryAddress) {
                $scope.chosenDeliveryAddressId = response.requirements.deliveryAddress.id;
                $scope.newOrUpdatedAddress = response.requirements.deliveryAddress;
            }
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $q.all(initPromises).then(() => LoadingService.hide());

    function setLabel() {
        $scope.newOrUpdatedAddress.label = ($scope.newOrUpdatedAddress.label ? $scope.newOrUpdatedAddress.label : $scope.newOrUpdatedAddress.addressLine1);
    }

    $scope.$watch('chosenDeliveryAddressId', chosenDeliveryAddressId => {
        if (!chosenDeliveryAddressId) {
            $scope.newOrUpdatedAddress = angular.copy(newAddress);
            return;
        }

        $scope.existingAddresses.forEach(address => {
            if (chosenDeliveryAddressId === address.id) {
                $scope.newOrUpdatedAddress = address;
            }
        });
    });

    $scope.nextStep = () => {
        if ($scope.mealPlanSetupForm && $scope.mealPlanSetupForm.$invalid) {
            $scope.mealPlanSetupForm.$submitted = true;
            return;
        }

        LoadingService.show();

        setLabel();

        let promise;

        if ($scope.chosenDeliveryAddressId) {
            promise = AddressFactory.updateAddress($scope.newOrUpdatedAddress.id, $scope.newOrUpdatedAddress)
                .then(response => response.data.updatedAddress.id);
        } else {
            promise = AddressFactory.createAddress($scope.newOrUpdatedAddress, $routeParams.customerId)
                .then(response => response.data.newAddress.id);
        }

        promise.then(addressId => {
                const upsert = {deliveryAddress: addressId};

                MealPlanFactory.setCustomerMealPlanRequirements($routeParams.customerId, upsert)
                    .success(response => $location.path(`/admin/meal-plan/customer/${$routeParams.customerId}/setup/payment`))
                    .catch(response => NotificationService.notifyError(response.data.errorTranslation));
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
