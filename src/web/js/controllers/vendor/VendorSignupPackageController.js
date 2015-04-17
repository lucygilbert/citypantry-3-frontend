angular.module('cp.controllers.vendor').controller('VendorSignupPackageController',
        function($scope, DocumentTitleService) {
    DocumentTitleService('Vendor signup');

    $scope.package = {
        allergenTypes: [],
        costOfVat: (0).toFixed(2),
        deliveryDays: [],
        deliveryTimeEnd: 2000,
        deliveryTimeStart: 800,
        dietaryRequirements: [],
        eventTypes: [],
        items: ['', '', '', ''],
        images: [],
        maxPeople: 50,
        minPeople: 10
    };
});
