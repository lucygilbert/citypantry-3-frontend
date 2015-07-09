angular.module('cp.controllers.admin').controller('AdminMasqueradeLogoutController', function(
        $scope, LoadingService, UsersFactory, NotificationService, AuthenticationFactory, $window,
        $cookies, DocumentTitleService, SecurityService) {
    DocumentTitleService('Masquerade logout');

    UsersFactory.getStaffEmailById(SecurityService.getStaffUserIdIfMasquerading())
        .success(response => {
            $scope.email = response.email;
            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.errorTranslation));

    function login(email, password) {
        AuthenticationFactory.login({email: email, plainPassword: password})
            .success(response => {
                $cookies.userId = response.apiAuth.userId;
                $cookies.salt = response.apiAuth.salt;
                $cookies.staffMasqueraderId = null;
                $window.localStorage.setItem('user', JSON.stringify(response.user));
                $window.location = '/admin/users';
            })
            .error(response => $scope.loginError = response.errorTranslation);
    }

    $scope.goBackToAdmin = function() {
        login($scope.email, $scope.plainPassword);
    };
});
