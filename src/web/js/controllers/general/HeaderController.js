angular.module('cp.controllers.general').controller('HeaderController', function($scope,
      $rootScope, $window, $location, SecurityService, CP_TELEPHONE_NUMBER_UK, CP_TELEPHONE_NUMBER_INTERNATIONAL,
      getTemplateUrl, AuthenticationFactory, UsersFactory, NotificationService) {
    const templateUrl = (x) => getTemplateUrl('general/' + x + '-nav-menu-items.html'),
        blankToDefault = (x) => x === null ? 'default' : x;

    $scope.navMenuItemsTemplateUrl = () => templateUrl(blankToDefault(SecurityService.getGroup()));
    $scope.phoneNumberUk = CP_TELEPHONE_NUMBER_UK;
    $scope.phoneNumberInternational = CP_TELEPHONE_NUMBER_INTERNATIONAL;
    $scope.navMenuPresented = true;
    $scope.togglePresentNavMenu = () => $scope.navMenuPresented = !$scope.navMenuPresented;
    $scope.isStaffMasquerading = !!SecurityService.getStaffUserIdIfMasquerading();
    $scope.showPayOnAccountMenuItem = false;
    $scope.showMealPlansMenuItem = false;

    if (SecurityService.customerIsLoggedIn()) {
        SecurityService.getCustomer()
            .then((customer) => {
                $scope.showPayOnAccountMenuItem = customer.paidOnAccountStatus !== 0;
                $scope.showMealPlansMenuItem = customer.mealPlanStatusText === 'active';
            });
    }

    $rootScope.$on('$routeChangeStart', () => $scope.navMenuCollapsed = true);

    $scope.decideLogoLink = () => {
        if ($window.location.href.indexOf('/login') > -1) {
            $window.location.href = window.hubspotBase;
        } else {
            $location.path('/');
        }
    };

    $scope.goToMasqueradeLogoutPage = () => {
        $location.path('/admin/masquerade-logout');
    };
});
