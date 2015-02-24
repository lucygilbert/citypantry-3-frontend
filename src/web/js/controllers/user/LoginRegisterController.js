angular.module('cp.controllers.user', []);

angular.module('cp.controllers.user').controller('LoginRegisterController',
        function($scope, $http, $cookies, $window, DocumentTitleService, SecurityService, API_BASE, LoadingService) {
    DocumentTitleService('Log in / Sign up to City Pantry');
    SecurityService.requireLoggedOut();
    LoadingService.hide();

    $scope.login = function() {
        LoadingService.show();

        $scope.loginError = null;

        var loginDetails = {
            email: $scope.email,
            plainPassword: $scope.plainPassword
        };

        $http.post(API_BASE + '/user/login', loginDetails)
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

    $scope.register = function() {
        LoadingService.show();

        $scope.registerError = null;

        var registerDetails = {
            name: $scope.name,
            email: $scope.email,
            plainPassword: $scope.plainPassword
        };

        $http.post(API_BASE + '/user/register', registerDetails)
            .then(function(response) {
                $cookies.userId = response.data.apiAuth.userId;
                $cookies.salt = response.data.apiAuth.salt;
                $window.localStorage.setItem('user',
                        JSON.stringify(response.data.user));
                $window.location = '/';
            })
            .catch(function(response) {
                $scope.registerError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
