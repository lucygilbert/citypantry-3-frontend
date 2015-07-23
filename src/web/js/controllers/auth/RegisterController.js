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
            company: $scope.company,
            selfIdentifiedPersona: $scope.selfIdentifiedPersona
        };

        AuthenticationFactory.registerCustomer(registerDetails)
            .success(function(response) {
                $cookies.userId = response.apiAuth.userId;
                $cookies.salt = response.apiAuth.salt;
                // This is now an non-masquerade, so make sure the masquerade cookie is removed
                // so the "back to admin" button doesn't appear.
                $cookies.staffMasqueraderId = null;
                $window.localStorage.setItem('user', JSON.stringify(response.user));

                // Redirect to the next page -- this can be configured through
                // `SecurityService.urlToForwardToAfterLogin`. Add a query string to let the Twig
                // layout know to include the post-registration tracking code.
                const registrationTrackingCodeQueryString = 'includeRegistrationTrackingCode=1';
                if (SecurityService.urlToForwardToAfterLogin) {
                    const nextUrl = SecurityService.urlToForwardToAfterLogin +
                        (
                            SecurityService.urlToForwardToAfterLogin.indexOf('?') === -1 ?
                                `?${registrationTrackingCodeQueryString}` :
                                `&${registrationTrackingCodeQueryString}`
                        );
                    $window.location = nextUrl;
                } else {
                    $window.location = '/?' + registrationTrackingCodeQueryString;
                }
            })
            .catch(function(response) {
                $scope.registerError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
