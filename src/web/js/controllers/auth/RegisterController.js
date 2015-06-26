angular.module('cp.controllers.authentication').controller('RegisterController',
        function($scope, $cookies, $window, $location, AuthenticationFactory, LoadingService,
        DocumentTitleService, SecurityService, ABTestService) {
    LoadingService.hide();
    SecurityService.requireLoggedOut();
    DocumentTitleService('New to City Pantry? Sign up!');

    $scope.submit = function() {
        if ($scope.registerForm.$invalid) {
            $scope.registerForm.$submitted = true;
            return false;
        }

        LoadingService.show();

        $scope.registerError = null;

        const registerDetails = {
            name: $scope.name,
            email: $scope.email,
            plainPassword: $scope.plainPassword,
            company: $scope.company
        };

        AuthenticationFactory.registerCustomer(registerDetails)
            .success(function(response) {
                $cookies.userId = response.apiAuth.userId;
                $cookies.salt = response.apiAuth.salt;
                let includeCode = 'includeRegistrationTrackingCode=1';
                $window.localStorage.setItem('user', JSON.stringify(response.user));
                if (SecurityService.urlToForwardToAfterLogin) {
                    $window.location = SecurityService.urlToForwardToAfterLogin +
                        (SecurityService.urlToForwardToAfterLogin.indexOf('?') < 0 ?
                        '?' + includeCode : '&' + includeCode);
                } else {
                    $window.location = '/?' + includeCode;
                }
            })
            .catch(function(response) {
                $scope.registerError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
