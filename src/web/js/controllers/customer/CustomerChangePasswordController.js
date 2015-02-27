angular.module('cp.controllers.customer', []);

angular.module('cp.controllers.customer').controller('CustomerChangePasswordController',
        function($scope, UsersFactory, DocumentTitleService, SecurityService, LoadingService, NotificationService) {
    DocumentTitleService('My details');
    SecurityService.requireLoggedIn();
    LoadingService.hide();

    $scope.save = function () {
        if ($scope.newPassword === $scope.confirmPassword) {
            var updatedPasswords = {
                newPassword: $scope.newPassword,
                currentPassword: $scope.currentPassword
            };
            LoadingService.show();

            UsersFactory.changeOwnPassword(updatedPasswords).success(() => {
                $scope.newPassword = "";
                $scope.confirmPassword = "";
                $scope.currentPassword = "";
                NotificationService.notifySuccess('Your password has been updated.');
                LoadingService.hide();
            }).catch(response => {
                $scope.newPassword = "";
                $scope.confirmPassword = "";
                $scope.currentPassword = "";
                NotificationService.notifyError(response.data.errorTranslation)
            });
        } else {
            $scope.newPassword = "";
            $scope.confirmPassword = "";
            $scope.currentPassword = "";
            NotificationService.notifyError('The two passwords you entered do not match.');
        }
    }
});
