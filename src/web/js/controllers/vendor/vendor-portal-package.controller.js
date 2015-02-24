angular.module('cp.controllers.vendor', []);

angular.module('cp.controllers.vendor').controller('VendorPortalPackageController',
        function($scope, $routeParams, DocumentTitleService, LoadingService, SecurityService, PackagesFactory) {
    SecurityService.requireVendor();

    $scope.package = {
        allergenTypes: [],
        deliveryDays: [],
        deliveryTimeEnd: '2000',
        deliveryTimeStart: '0800',
        dietaryTypes: [],
        eventTypes: [],
        items: [{}, {}, {}, {}],
        maxPeople: 50,
        minPeople: 10
    };

    if ($routeParams.id) {
        PackagesFactory.getPackage($routeParams.id).then(response => {
            $scope.package = response;
            DocumentTitleService('Edit package');
            LoadingService.hide();
        });
    } else {
        DocumentTitleService('Create package');
        LoadingService.hide();
    }
});
