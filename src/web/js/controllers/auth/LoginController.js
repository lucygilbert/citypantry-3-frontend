angular.module('cp.controllers.authentication', [
    'ngCookies'
]);

angular.module('cp.controllers.authentication').controller('LoginController',
        function($scope, $http, API_BASE, $cookies, $window) {
    $scope.submit = function() {
        $scope.loginError = null;

        var loginDetails = {
            email: $scope.email,
            plainPassword: $scope.plainPassword,
        };

        $http.post(API_BASE + '/user/login', loginDetails).then(function(response) {
            $cookies.userId = response.data.apiAuth.userId;
            $cookies.salt = response.data.apiAuth.salt;
            $window.localStorage.setItem('user', JSON.stringify(response.data.user));
            $window.location = '/';
        }).catch(function(response) {
            $scope.loginError = response.data.errorTranslation;
        })
    };
});
