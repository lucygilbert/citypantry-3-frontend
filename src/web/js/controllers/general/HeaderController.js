angular.module('cp.controllers.general', []);

angular.module('cp.controllers.general').controller('HeaderController', function($scope,
      $rootScope, SecurityService, CP_TELEPHONE_NUMBER_UK, CP_TELEPHONE_NUMBER_INTERNATIONAL) {
    var templateUrl = (x) => '/dist/templates/general/' + x + '-nav-menu-items.html',
        blankToDefault = (x) => x === '' ? 'default' : x;

    $scope.navMenuItemsTemplateUrl = () => templateUrl(blankToDefault(SecurityService.group()));
    $scope.phoneNumberUk = CP_TELEPHONE_NUMBER_UK;
    $scope.phoneNumberInternational = CP_TELEPHONE_NUMBER_INTERNATIONAL;
    $scope.navMenuPresented = true;
    $scope.togglePresentNavMenu = () => $scope.navMenuPresented = !$scope.navMenuPresented;

    $rootScope.$on('$routeChangeStart', () => $scope.navMenuCollapsed = true);
});
