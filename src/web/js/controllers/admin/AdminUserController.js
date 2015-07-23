angular.module('cp.controllers.admin').controller('AdminUserController', function ($scope,
        $routeParams, UsersFactory, NotificationService, DocumentTitleService, SecurityService,
        LoadingService) {
    SecurityService.requireStaff();

    const id = $routeParams.userId;

    UsersFactory.getUser(id)
        .success(response => {
            $scope.user = response.user;
            DocumentTitleService(`User: ${response.user.email}`);
            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.errorTranslation));
});
