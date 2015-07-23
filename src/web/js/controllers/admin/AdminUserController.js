angular.module('cp.controllers.admin').controller('AdminUserController', function ($scope,
        $routeParams, UsersFactory, NotificationService, DocumentTitleService, SecurityService,
        LoadingService, VendorUsersFactory) {
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
});
