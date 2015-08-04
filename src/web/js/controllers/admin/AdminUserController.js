angular.module('cp.controllers.admin').controller('AdminUserController', function ($scope,
        $routeParams, UsersFactory, NotificationService, DocumentTitleService, SecurityService,
        LoadingService, VendorUsersFactory, $location) {
    SecurityService.requireStaff();

    function loadUser() {
        UsersFactory.getUser($routeParams.userId)
            .success(response => {
                $scope.user = response.user;
                $scope.customer = response.customer;
                $scope.isCustomer = response.isCustomer;
                $scope.vendor = response.vendor;
                $scope.isVendor = response.isVendor;
                $scope.isStaff = response.isStaff;

                DocumentTitleService(`User: ${response.user.email}`);
                LoadingService.hide();
            })
            .error(response => NotificationService.notifyError(response.errorTranslation));
    }

    loadUser();

    $scope.removeUserFromVendor = () => {
        LoadingService.show();

        VendorUsersFactory.removeUserFromVendor($scope.vendor.id, $scope.user.id)
            .success(loadUser)
            .error(response => NotificationService.notifyError(response.errorTranslation));
    };

    $scope.save = () => {
        LoadingService.show();

        const updatedUser = {
            name: $scope.user.name,
            email: $scope.user.email
        };
        UsersFactory.updateUser($scope.user.id, updatedUser)
            .success(response => {
                NotificationService.notifySuccess('The user has been edited.');
                loadUser();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.changeUserPassword = () => $location.path(`/admin/user/${$routeParams.userId}/password`);
});
