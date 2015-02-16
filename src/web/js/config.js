angular.module('cp.controllers.admin', []);

angular.module('cp').config(function($routeProvider) {
    $routeProvider.
        when('/', {
            redirectTo: '/search'
        }).
        when('/login', {
            controller: 'LoginRegisterController',
            templateUrl: '/dist/templates/auth/login-register.html'
        }).
        when('/search', {
            controller: 'SearchController',
            controllerAs: 'search',
            templateUrl: '/dist/templates/general/search.html'
        }).
        when('/vendors', {
            controller: 'VendorsController',
            templateUrl: '/dist/templates/general/vendors.html'
        }).
        when('/vendor/:idOrSlug', {
            controller: 'ViewVendorController',
            templateUrl: '/dist/templates/general/view-vendor.html'
        }).
        when('/vendor-portal/orders', {
            controller: 'VendorPortalOrdersController',
            templateUrl: '/dist/templates/vendor/orders.html'
        }).
        when('/package/:humanIdAndSlug', {
            controller: 'ViewPackageController',
            templateUrl: '/dist/templates/general/view-package.html'
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
        when('/logout', {
            controller: () => window.location = '/logout',
            template: '<div class="wrapper">Logging out...</div>'
        }).
        otherwise({
            template: '<h1 class="wrapper">Page not found</h1>'
        });
});
