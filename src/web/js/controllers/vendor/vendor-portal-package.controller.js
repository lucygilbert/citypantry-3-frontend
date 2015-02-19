angular.module('cp.controllers.vendor', []);

angular.module('cp.controllers.vendor').controller('VendorPortalPackageController',
        function($scope, $routeParams, DocumentTitleService, LoadingService, SecurityService, PackagesFactory) {
    SecurityService.requireVendor();

    $scope.package = {
        allergenTypes: [],
        deliveryDays: [],
        deliveryTimeEnd: 0,
        deliveryTimeStart: 0,
        dietaryTypes: [],
        eventTypes: [],
        items: [{}, {}, {}, {}],
        maxPeople: 1,
        minPeople: 1
    };

    if ($routeParams.id) {
        PackagesFactory.getPackage($routeParams.id).then(response => {
            $scope.package = response;
            DocumentTitleService('Edit package ' + $scope.package.humanId);
            LoadingService.hide();
        });
    } else {
        DocumentTitleService('Create package');
        LoadingService.hide();
    }
});
