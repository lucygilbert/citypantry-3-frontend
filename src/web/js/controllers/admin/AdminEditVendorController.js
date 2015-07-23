angular.module('cp.controllers.admin').controller('AdminEditVendorController', function($scope, $q,
        $routeParams, VendorsFactory, NotificationService, DocumentTitleService, SecurityService,
        LoadingService, VendorUsersFactory, $window, UsersFactory) {
    SecurityService.requireStaff();

    function loadVendor() {
        return VendorsFactory.getVendor($routeParams.vendorId)
            .success(vendor => {
                $scope.vendor = vendor;
                DocumentTitleService('Edit vendor: ' + $scope.vendor.name);
            })
            .error(response => NotificationService.notifyError(response.errorTranslation));
    }

    function loadReviews() {
        return VendorsFactory.getVendorReviews($routeParams.vendorId)
            .success(response => $scope.reviews = response.reviews)
            .error(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    function loadUsers() {
        return VendorUsersFactory.getVendorUsers($routeParams.vendorId)
            .success(response => $scope.users = response.users)
            .error(response => NotificationService.notifyError(response.errorTranslation));
    }

    function load() {
        $scope.vendor = {};
        $scope.users = [];
        $scope.newUser = {};

        const loadingPromise1 = loadVendor();
        const loadingPromise2 = loadReviews();
        const loadingPromise3 = loadUsers();

        $q.all([loadingPromise1, loadingPromise2, loadingPromise3])
            .then(LoadingService.hide);
    }

    load();

    $scope.save = function() {
        LoadingService.show();

        const misspellings = String($scope.vendor.misspellings).split(/, ?/g);
        const updatedVendor = {
            name: $scope.vendor.name,
            description: $scope.vendor.description,
            cityPantryCommission: $scope.vendor.cityPantryCommission,
            misspellings: misspellings,
            isMealPlan: $scope.vendor.isMealPlan
        };
        VendorsFactory.updateVendor($routeParams.vendorId, updatedVendor)
            .success(response => {
                $scope.vendor = response.updatedObject;
                NotificationService.notifySuccess('The vendor has been edited.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.removeUserFromVendor = function(user) {
        if (!$window.confirm(`Are you sure you want to remove ${user.email}?`)) {
            return;
        }

        LoadingService.show();

        VendorUsersFactory.removeUserFromVendor($scope.vendor.id, user.id)
            .success(load)
            .error(response => NotificationService.notifyError(response.errorTranslation));
    };

    $scope.addNewUser = () => {
        UsersFactory.isEmailInUse($scope.newUser.email).then(isInUse => {
            if (isInUse) {
                VendorUsersFactory.addExistingUserToVendor($scope.vendor.id, $scope.newUser.email)
                    .success(load)
                    .error(response => NotificationService.notifyError(response.errorTranslation));
            } else  {
                const name = $window.prompt('What is the new user\'s real name?');
                const password = $window.prompt('What do you want to set the new user\'s password to?');
                VendorUsersFactory.addNewUserToVendor($scope.vendor.id, name, $scope.newUser.email, password)
                    .success(load)
                    .error(response => NotificationService.notifyError(response.errorTranslation));
            }
        });
    };
});
