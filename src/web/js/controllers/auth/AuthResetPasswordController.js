angular.module('cp.controllers.authentication', []);

angular.module('cp.controllers.authentication').controller('AuthResetPasswordController',
        function($scope, $routeParams, AuthenticationFactory, LoadingService, DocumentTitleService, SecurityService, NotificationService) {
    DocumentTitleService('Reset password');
    SecurityService.requireLoggedOut();
    LoadingService.hide();

    $scope.reset = function () {
        if ($scope.newPassword === $scope.confirmPassword) {
            var resetDetails = {
                userId: $routeParams.userId,
                token: $routeParams.token,
                plainPassword: $scope.newPassword
            };
            LoadingService.show();

            AuthenticationFactory.setPassword(resetDetails).success(() => {
                clearPasswordFields();
                NotificationService.notifySuccess('Your password has been reset.');
                LoadingService.hide();
            }).catch(response => {
                clearPasswordFields();
                NotificationService.notifyError(response.data.errorTranslation);
            });
        } else {
            clearPasswordFields();
            NotificationService.notifyError('The two passwords you entered do not match.');
        }
    };

    function clearPasswordFields() {
        $scope.newPassword = '';
        $scope.confirmPassword = '';
    }
});
