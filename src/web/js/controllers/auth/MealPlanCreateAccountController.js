angular.module('cp.controllers.authentication').controller('MealPlanCreateAccountController',
        function($scope, $cookies, $routeParams, $window, SecurityService, DocumentTitleService,
        LoadingService, NotificationService, UsersFactory) {
    DocumentTitleService('Create account');

    $scope.userHasPassword = false;

    UsersFactory.getLoggedInUser($routeParams.userId, $routeParams.otat)
        .success(response => {
            $scope.user = response.user;
            $cookies.userId = $scope.user.id;
            $cookies.otat = $routeParams.otat;
            $window.localStorage.setItem('user', JSON.stringify($scope.user));

            $scope.userHasPassword = response.userHasPassword;

            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    function clearPasswordFields() {
        $scope.newPassword = '';
        $scope.confirmPassword = '';
    }

    $scope.create = function() {
        if ($scope.newPassword !== $scope.confirmPassword) {
            clearPasswordFields();
            NotificationService.notifyError('The two passwords you have entered do not match.');
            return false;
        }

        LoadingService.show();

        $scope.createAccountError = null;

        var passwords = {
            newPassword: $scope.newPassword,
            currentPassword: null
        };

        UsersFactory.changeOwnPassword(passwords)
            .success(function(response) {
                $window.location = '/';
            })
            .catch(function(response) {
                $scope.createAccountError = response.data.errorTranslation;
                LoadingService.hide();
            });
    };

    $scope.continue = function() {
        $window.location = '/';
    };
});
