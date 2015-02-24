angular.module('cp.controllers.vendor').controller('VendorSignupPackageController',
        function($scope, DocumentTitleService) {
    DocumentTitleService('Vendor signup');

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
});
