angular.module('cp.controllers.admin').controller('AdminUserPasswordController', function ($scope,
        $routeParams, UsersFactory, NotificationService, DocumentTitleService, SecurityService,
        LoadingService, $location) {
    SecurityService.requireStaff();

    UsersFactory.getUser($routeParams.userId)
        .success(response => {
            $scope.user = response.user;
            DocumentTitleService(`Password for ${response.user.email}`);
            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.errorTranslation));

    $scope.changePassword = () => {
        UsersFactory.changeUserPassword($scope.user.id)
            .success(() => {
                $location.path(`/admin/user/${$routeParams.userId}`);
                NotificationService.notifySuccess('Done.');
            })
            .error(response => NotificationService.notifyError(response.errorTranslation));
    };
});
