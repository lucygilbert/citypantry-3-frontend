angular.module('cp.controllers.vendor').controller('VendorSignUpPackageController',
        function($scope, DocumentTitleService) {
    DocumentTitleService('Vendor sign up');

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
