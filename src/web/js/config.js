angular.module('cp.controllers.admin', []);

angular.module('cp').config(function($routeProvider) {
    $routeProvider.
        when('/admin/vendors', {
            controller: 'AdminVendorsController',
            controllerAs: 'vendors',
            templateUrl: '/dist/templates/admin/vendors.html'
        }).
        when('/admin/vendor/:vendorId', {
            controller: 'AdminEditVendorController',
            templateUrl: '/dist/templates/admin/edit-vendor.html'
        }).
        when('/admin/package/:packageId', {
            controller: 'AdminEditPackageController',
            templateUrl: '/dist/templates/admin/edit-package.html'
        }).
        when('/admin/users', {
            controller: 'AdminUsersController',
            templateUrl: '/dist/templates/admin/users.html'
        }).
        when('/admin/customers', {
            controller: 'AdminCustomersController',
            controllerAs: 'customers',
            templateUrl: '/dist/templates/admin/customers.html'
        }).
        when('/admin/customer/:customerId', {
            controller: 'AdminEditCustomerController',
            templateUrl: '/dist/templates/admin/customer.html'
        }).
        otherwise({
            // If there is no Angular route, this must be a Symfony route. Trigger a page refresh
            // so the page actually loads.
            controller: ($window => $window.location.reload()),
            template: 'Loadidng...'
        });
});
