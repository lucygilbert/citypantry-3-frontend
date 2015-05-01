angular.module('cp.controllers.user', []);

angular.module('cp.controllers.user').controller('ForgotPasswordController',
        function($scope, AuthenticationFactory, DocumentTitleService, SecurityService,
        LoadingService, NotificationService) {
    DocumentTitleService('Forgot your password?');
    SecurityService.requireLoggedOut();
    LoadingService.hide();

    $scope.requestResetEmail = function() {
        LoadingService.show();

        AuthenticationFactory.requestResetEmail({email: $scope.email})
            .success(response => {
                NotificationService.notifySuccess('The email has been sent.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
