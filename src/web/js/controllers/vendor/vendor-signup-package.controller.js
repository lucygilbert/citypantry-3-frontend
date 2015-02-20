angular.module('cp.controllers.vendor').controller('VendorSignupPackageController',
        function($scope, DocumentTitleService) {
    DocumentTitleService('Vendor signup');

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
});
