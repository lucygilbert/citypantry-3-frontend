angular.module('cp.controllers.user', []);

angular.module('cp.controllers.user').controller('LoginRegisterController',
        function($scope, $http, $cookies, $window, DocumentTitleService, SecurityService, API_BASE) {
    DocumentTitleService('Log in / Sign up to City Pantry');
    SecurityService.requireLoggedOut();

    $scope.login = function() {
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
            });
    };

    $scope.register = function() {
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
            });
    };
});
