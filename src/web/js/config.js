angular.module('cp.controllers.admin').config(function($routeProvider) {
    $routeProvider.
        when('/admin/vendor/:vendorId', {
            controller: 'AdminEditVendorController',
            templateUrl: '/dist/templates/vendor.html'
        });
});
