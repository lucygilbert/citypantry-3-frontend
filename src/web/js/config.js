angular.module('cp').config(function($routeProvider) {
    $routeProvider.
        when('/', {
            redirectTo: '/search'
        }).
        when('/login', {
            controller: 'LoginRegisterController',
            templateUrl: '/dist/templates/auth/login-register.html'
        }).
        when('/customer/dashboard', {
            controller: 'CustomerDashboardController',
            templateUrl: '/dist/templates/customer/dashboard.html'
        }).
        when('/search', {
            controller: 'SearchController',
            controllerAs: 'search',
            templateUrl: '/dist/templates/general/search.html'
        }).
        when('/quote', {
            controller: 'QuoteController',
            templateUrl: '/dist/templates/general/quote.html'
        }).
        when('/quote/vendor/:vendorId', {
            controller: 'QuoteController',
            templateUrl: '/dist/templates/general/quote.html'
        }).
        when('/customer/account-details', {
            controller: 'CustomerAccountDetailsController',
            templateUrl: '/dist/templates/customer/account-details.html'
        }).
        when('/customer/change-password', {
            controller: 'CustomerChangePasswordController',
            templateUrl: '/dist/templates/customer/change-password.html'
        }).
        when('/customer/addresses', {
            controller: 'CustomerAddressesController',
            templateUrl: '/dist/templates/customer/addresses.html'
        }).
        when('/customer/addresses/new', {
            controller: 'CustomerAddressController',
            templateUrl: '/dist/templates/customer/address.html'
        }).
        when('/customer/addresses/:id', {
            controller: 'CustomerAddressController',
            templateUrl: '/dist/templates/customer/address.html'
        }).
        when('/customer/orders', {
            controller: 'CustomerOrdersController',
            templateUrl: '/dist/templates/customer/orders.html'
        }).
        when('/customer/orders/:id/messages', {
            controller: 'CustomerOrderMessagesController',
            templateUrl: '/dist/templates/customer/order-messages.html'
        }).
        when('/customer/pay-on-account', {
            controller: 'CustomerPayOnAccountController',
            templateUrl: '/dist/templates/customer/pay-on-account.html'
        }).
        when('/customer/orders/:id/leave-a-review', {
            controller: 'CustomerOrderLeaveAReviewController',
            templateUrl: '/dist/templates/customer/order-leave-a-review.html'
        }).
        when('/reset-password/:userId/:token', {
            controller: 'AuthResetPasswordController',
            templateUrl: '/dist/templates/auth/reset-password.html'
        }).
        when('/vendors', {
            controller: 'VendorsController',
            templateUrl: '/dist/templates/general/vendors.html'
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
        when('/vendor/delivery-radiuses', {
            controller: 'VendorPortalDeliveryRadiusesController',
            templateUrl: '/dist/templates/vendor/vendor-portal-delivery-radiuses.html'
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
            templateUrl: '/dist/templates/general/view-vendor.html'
        }).
        when('/user/payment-cards', {
            controller: 'UserPaymentCardsController',
            templateUrl: '/dist/templates/user/payment-cards.html'
        }).
        when('/user/payment-cards/new', {
            controller: 'UserNewPaymentCardController',
            templateUrl: '/dist/templates/user/new-payment-card.html'
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
        when('/admin/vendors/edit', {
            controller: 'AdminEditVendorsController',
            controllerAs: 'vendors',
            templateUrl: '/dist/templates/admin/edit-vendors.html'
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
        when('/admin/packages/edit', {
            controller: 'AdminEditPackagesController',
            controllerAs: 'packages',
            templateUrl: '/dist/templates/admin/edit-packages.html'
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
            templateUrl: '/dist/templates/admin/edit-customer.html'
        }).
        when('/admin/invoices', {
            controller: 'AdminInvoicesController',
            templateUrl: '/dist/templates/admin/invoices.html'
        }).
        when('/admin/invoice/:invoiceId', {
            controller: 'AdminViewInvoiceController',
            templateUrl: '/dist/templates/admin/view-invoice.html'
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
