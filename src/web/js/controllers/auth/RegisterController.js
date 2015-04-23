angular.module('cp.controllers.authentication').controller('RegisterController',
        function($scope, $cookies, $window, AuthenticationFactory, LoadingService,
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
                ABTestService.isAllowedToSeeDashboardAndSearchResultsWhenLoggedOut
                    .addEvent('registered', {userId: response.apiAuth.userId})
                    .finally(() => {
                        $cookies.userId = response.apiAuth.userId;
                        $cookies.salt = response.apiAuth.salt;
                        $window.localStorage.setItem('user', JSON.stringify(response.user));
                        $window.location = '/';
                    });
            })
            .catch(function(response) {
                $scope.registerError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };
});
