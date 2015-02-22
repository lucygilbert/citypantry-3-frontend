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
            templateUrl: '/dist/templates/vendor/vendors.html'
        }).
        when('/vendor/orders', {
            controller: 'VendorPortalOrdersController',
            templateUrl: '/dist/templates/vendor/orders.html'
        }).
        when('/vendor/orders/:id/messages', {
            controller: 'VendorPortalOrderMessagesController',
            templateUrl: '/dist/templates/vendor/order-messages.html'
        }).
        when('/vendor/addresses', {
            controller: 'VendorPortalAddressesController',
            templateUrl: '/dist/templates/vendor/addresses.html'
        }).
        when('/vendor/addresses/:id', {
            controller: 'VendorPortalAddressController',
            templateUrl: '/dist/templates/vendor/address.html'
        }).
        when('/vendor/new-address', {
            controller: 'VendorPortalAddressController',
            templateUrl: '/dist/templates/vendor/address.html'
        }).
        when('/vendor/create-package', {
            controller: 'VendorPortalPackageController',
            templateUrl: '/dist/templates/vendor/vendor-portal-create-package.html'
        }).
        when('/vendor/packages', {
            controller: 'VendorPortalPackagesController',
            templateUrl: '/dist/templates/vendor/vendor-portal-packages.html'
        }).
        when('/vendor/packages/:id', {
            controller: 'VendorPortalPackageController',
            templateUrl: '/dist/templates/vendor/vendor-portal-edit-package.html'
        }).
        when('/vendor/profile', {
            controller: 'VendorPortalProfileController',
            templateUrl: '/dist/templates/vendor/vendor-portal-profile.html'
        }).
        when('/vendor/signup', {
            controller: 'VendorSignupController',
            templateUrl: '/dist/templates/vendor/vendor-signup.html'
        }).
        when('/vendor/signup/package', {
            controller: 'VendorSignupPackageController',
            templateUrl: '/dist/templates/vendor/vendor-signup-package.html'
        }).
        when('/vendor/signup/profile', {
            controller: 'VendorSignupProfileController',
            templateUrl: '/dist/templates/vendor/vendor-signup-profile.html'
        }).
        when('/vendor/signup/agreement', {
            controller: 'VendorSignupAgreementController',
            templateUrl: '/dist/templates/vendor/vendor-signup-agreement.html'
        }).
        when('/vendor/signup/thanks', {
            controller: 'VendorSignupThanksController',
            templateUrl: '/dist/templates/vendor/vendor-signup-thanks.html'
        }).
        when('/vendor/:idOrSlug', {
            controller: 'ViewVendorController',
            templateUrl: '/dist/templates/vendor/view-vendor.html'
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
