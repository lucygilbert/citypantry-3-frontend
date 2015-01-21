angular.module('cp.controllers.authentication').controller('RegisterController',
        function($scope, $http, API_BASE, $cookies, $window) {
    $scope.submit = function() {
        $scope.registerError = null;

        var registerDetails = {
            name: $scope.name,
            email: $scope.email,
            plainPassword: $scope.plainPassword,
        };

        $http.post(API_BASE + '/user/register', registerDetails).then(function(response) {
            $cookies.userId = response.data.apiAuth.userId;
            $cookies.salt = response.data.apiAuth.salt;
            $window.localStorage.setItem('user', JSON.stringify(response.data.user));
            $window.location = '/';
        }).catch(function(response) {
            $scope.registerError = response.data.errorTranslation;
        })
    };
});
