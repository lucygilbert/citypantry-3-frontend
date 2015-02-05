angular.module('cp.controllers.admin', []);

angular.module('cp').config(function($routeProvider) {
    $routeProvider.
        when('/search', {
            controller: 'SearchController',
            controllerAs: 'search',
            templateUrl: '/dist/templates/general/search.html'
        }).
        when('/vendors', {
            controller: 'ViewVendorController',
            templateUrl: '/dist/templates/general/view-vendor.html'
        }).
        when('/vendor/:idOrSlug', {
            controller: 'ViewVendorController',
            templateUrl: '/dist/templates/general/view-vendor.html'
        }).
        when('/admin/vendors', {
            controller: 'AdminVendorsController',
            controllerAs: 'vendors',
            templateUrl: '/dist/templates/admin/vendors.html'
        }).
        when('/admin/vendor/:vendorId', {
            controller: 'AdminEditVendorController',
            templateUrl: '/dist/templates/admin/edit-vendor.html'
        }).
        when('/admin/packages', {
            controller: 'AdminPackagesController',
            controllerAs: 'packages',
            templateUrl: '/dist/templates/admin/packages.html'
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
            templateUrl: '/dist/templates/admin/customers.html'
        }).
        when('/admin/customer/:customerId', {
            controller: 'AdminEditCustomerController',
            templateUrl: '/dist/templates/admin/customer.html'
        }).
        when('/admin/orders', {
            controller: 'AdminOrdersController',
            controllerAs: 'orders',
            templateUrl: '/dist/templates/admin/orders.html'
        }).
        when('/admin/order/:orderId', {
            controller: 'AdminEditOrderController',
            controllerAs: 'order',
            templateUrl: '/dist/templates/admin/edit-order.html'
        }).
        when('/admin/orders/courier', {
            controller: 'AdminCourierOrdersController',
            templateUrl: '/dist/templates/admin/courier-orders.html'
        }).
        otherwise({
            // If there is no Angular route, this must be a Symfony route. Trigger a page refresh
            // so the page actually loads.
            controller: ($window => $window.location.reload()),
            template: 'Loading...'
        });
});
