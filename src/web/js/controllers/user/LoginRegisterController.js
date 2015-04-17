angular.module('cp.controllers.user', []);

angular.module('cp.controllers.user').controller('LoginRegisterController',
        function($scope, $http, $cookies, $window, AuthenticationFactory, DocumentTitleService, SecurityService,
        LoadingService, NotificationService) {
    DocumentTitleService('Log in');
    SecurityService.requireLoggedOut();
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
                $window.location = '/';
            })
            .catch(function(response) {
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
