angular.module('cp.controllers.user').controller('LoginRegisterController',
        function($scope, $cookies, $window, AuthenticationFactory, DocumentTitleService, SecurityService,
        LoadingService, NotificationService, ABTestService) {
    DocumentTitleService('Log in');
    LoadingService.hide();

    $scope.login = function() {
        LoadingService.show();

        $scope.loginError = null;

        var loginDetails = {
            email: $scope.email,
            plainPassword: $scope.plainPassword
        };

        AuthenticationFactory.login(loginDetails)
            .then(function(response) {
                $cookies.userId = response.data.apiAuth.userId;
                $cookies.salt = response.data.apiAuth.salt;
                $window.localStorage.setItem('user',
                        JSON.stringify(response.data.user));
                if (SecurityService.urlToForwardToAfterLogin) {
                    $window.location = SecurityService.urlToForwardToAfterLogin;
                } else {
                    $window.location = '/';
                }
            })
            .catch(function(response) {
                if (!response || !response.data.errorTranslation) {
                    $scope.loginError = 'An unknown error occurred.';
                }
                $scope.loginError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };

    $scope.forgotPassword = function () {
        LoadingService.show();
        var resetEmail = { email: $scope.resetEmail };

        AuthenticationFactory.requestResetEmail(resetEmail).success(response => {
            NotificationService.notifySuccess('The email has been sent.');
            LoadingService.hide();
            $scope.closeDialog();
        }).catch(response => {
            NotificationService.notifyError(response.data.errorTranslation);
        });
    };

    $scope.closeDialog = function () {
        $scope.resetEmail = '';
        $scope.isOpen = false;
    };
});
