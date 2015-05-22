angular.module('cp').config(function($routeProvider, $analyticsProvider, getTemplateUrl) {
    $routeProvider.
        when('/', {
            controller: (SecurityService, $location, SupplierAgreementService) => {
                if (SecurityService.customerIsLoggedIn()) {
                    $location.url('/customer/dashboard');
                } else if (SecurityService.vendorIsLoggedIn()) {
                    // The page to go to depends on whether the vendor has accepted the latest
                    // supplier agreement. If they haven't, we want to force them to accept before
                    // browsing any other pages.
                    SupplierAgreementService.vendorHasAcceptedSupplierAgreement(SecurityService.getVendor())
                        .then(function(hasAccepted) {
                            if (hasAccepted) {
                                $location.url('/vendor/orders');
                            } else {
                                $location.url('/vendor/supplier-agreement');
                            }
                        });
                } else if (SecurityService.staffIsLoggedIn()) {
                    $location.url('/admin/orders');
                } else {
                    $location.url('/login');
                }
            },
            template: '<div class="wrapper">Loading...</div>'
        }).
        when('/login', {
            controller: 'LoginRegisterController',
            templateUrl: getTemplateUrl('auth/login-register.html')
        }).
        when('/register', {
            controller: 'RegisterController',
            templateUrl: getTemplateUrl('auth/register.html')
        }).
        when('/forgot-password', {
            controller: 'ForgotPasswordController',
            templateUrl: getTemplateUrl('auth/forgot-password.html')
        }).
        when('/customer/dashboard', {
            controller: 'CustomerDashboardController',
            templateUrl: getTemplateUrl('customer/dashboard.html')
        }).
        when('/search', {
            controller: 'SearchController',
            templateUrl: getTemplateUrl('general/search.html')
        }).
        when('/quote', {
            controller: 'QuoteController',
            templateUrl: getTemplateUrl('general/quote.html')
        }).
        when('/quote/vendor/:vendorId', {
            controller: 'QuoteController',
            templateUrl: getTemplateUrl('general/quote.html')
        }).
        when('/checkout/catering-details', {
            controller: 'CheckoutCateringDetailsController',
            templateUrl: getTemplateUrl('general/checkout-catering-details.html')
        }).
        when('/checkout/delivery-details', {
            controller: 'CheckoutDeliveryDetailsController',
            templateUrl: getTemplateUrl('general/checkout-delivery-details.html')
        }).
        when('/checkout/payment', {
            controller: 'CheckoutPaymentController',
            templateUrl: getTemplateUrl('general/checkout-payment.html')
        }).
        when('/checkout/thank-you', {
            controller: 'CheckoutThankYouController',
            templateUrl: getTemplateUrl('general/checkout-thank-you.html')
        }).
        when('/customer/account-details', {
            controller: 'CustomerAccountDetailsController',
            templateUrl: getTemplateUrl('customer/account-details.html')
        }).
        when('/customer/change-password', {
            controller: 'CustomerChangePasswordController',
            templateUrl: getTemplateUrl('customer/change-password.html')
        }).
        when('/customer/addresses', {
            controller: 'CustomerAddressesController',
            templateUrl: getTemplateUrl('customer/addresses.html')
        }).
        when('/customer/addresses/new', {
            controller: 'CustomerAddressController',
            templateUrl: getTemplateUrl('customer/address.html')
        }).
        when('/customer/addresses/:id', {
            controller: 'CustomerAddressController',
            templateUrl: getTemplateUrl('customer/address.html')
        }).
        when('/customer/orders', {
            controller: 'CustomerOrdersController',
            templateUrl: getTemplateUrl('customer/orders.html')
        }).
        when('/customer/orders/:id/messages', {
            controller: 'CustomerOrderMessagesController',
            templateUrl: getTemplateUrl('customer/order-messages.html')
        }).
        when('/customer/pay-on-account', {
            controller: 'CustomerPayOnAccountController',
            templateUrl: getTemplateUrl('customer/pay-on-account.html')
        }).
        when('/customer/orders/:id/leave-a-review', {
            controller: 'CustomerOrderLeaveAReviewController',
            templateUrl: getTemplateUrl('customer/order-leave-a-review.html')
        }).
        when('/customer/meal-plans', {
            controller: 'CustomerMealPlansController',
            templateUrl: getTemplateUrl('customer/meal-plan/list.html')
        }).
        when('/customer/meal-plans/:mealPlanId/review', {
            controller: 'CustomerMealPlanReviewController',
            templateUrl: getTemplateUrl('customer/meal-plan/review.html')
        }).
        when('/customer/meal-plans/:mealPlanId/edit-orders', {
            controller: 'CustomerMealPlanEditOrdersController',
            templateUrl: getTemplateUrl('customer/meal-plan/edit-orders.html')
        }).
        when('/customer/meal-plans/:mealPlanId/confirm', {
            controller: 'CustomerMealPlanConfirmationController',
            templateUrl: getTemplateUrl('customer/meal-plan/confirmation.html')
        }).
        when('/customer/meal-plans/:mealPlanId/success', {
            controller: 'CustomerMealPlanSuccessController',
            templateUrl: getTemplateUrl('customer/meal-plan/success.html')
        }).
        when('/reset-password/:userId/:token', {
            controller: 'AuthResetPasswordController',
            templateUrl: getTemplateUrl('auth/reset-password.html')
        }).
        when('/vendors', {
            controller: 'VendorsController',
            templateUrl: getTemplateUrl('general/vendors.html')
        }).
        when('/vendor/orders', {
            controller: 'VendorPortalOrdersController',
            templateUrl: getTemplateUrl('vendor/orders.html')
        }).
        when('/vendor/orders/:id/messages', {
            controller: 'VendorPortalOrderMessagesController',
            templateUrl: getTemplateUrl('vendor/order-messages.html')
        }).
        when('/vendor/addresses', {
            controller: 'VendorPortalAddressesController',
            templateUrl: getTemplateUrl('vendor/addresses.html')
        }).
        when('/vendor/addresses/:id', {
            controller: 'VendorPortalAddressController',
            templateUrl: getTemplateUrl('vendor/address.html')
        }).
        when('/vendor/new-address', {
            controller: 'VendorPortalAddressController',
            templateUrl: getTemplateUrl('vendor/address.html')
        }).
        when('/vendor/create-package', {
            controller: 'VendorPortalPackageController',
            templateUrl: getTemplateUrl('vendor/vendor-portal-create-package.html')
        }).
        when('/vendor/packages', {
            controller: 'VendorPortalPackagesController',
            templateUrl: getTemplateUrl('vendor/vendor-portal-packages.html')
        }).
        when('/vendor/packages/:id', {
            controller: 'VendorPortalPackageController',
            templateUrl: getTemplateUrl('vendor/vendor-portal-edit-package.html')
        }).
        when('/vendor/profile', {
            controller: 'VendorPortalProfileController',
            templateUrl: getTemplateUrl('vendor/vendor-portal-profile.html')
        }).
        when('/vendor/delivery-radiuses', {
            controller: 'VendorPortalDeliveryRadiusesController',
            templateUrl: getTemplateUrl('vendor/vendor-portal-delivery-radiuses.html')
        }).
        when('/vendor/signup', {
            controller: 'VendorSignupController',
            templateUrl: getTemplateUrl('vendor/vendor-signup.html')
        }).
        when('/vendor/signup/package', {
            controller: 'VendorSignupPackageController',
            templateUrl: getTemplateUrl('vendor/vendor-signup-package.html')
        }).
        when('/vendor/signup/profile', {
            controller: 'VendorSignupProfileController',
            templateUrl: getTemplateUrl('vendor/vendor-signup-profile.html')
        }).
        when('/vendor/signup/agreement', {
            controller: 'VendorSignupAgreementController',
            templateUrl: getTemplateUrl('vendor/vendor-signup-agreement.html')
        }).
        when('/vendor/signup/thanks', {
            controller: 'VendorSignupThanksController',
            templateUrl: getTemplateUrl('vendor/vendor-signup-thanks.html')
        }).
        when('/vendor/holidays', {
            controller: 'VendorHolidaysController',
            templateUrl: getTemplateUrl('vendor/holidays.html')
        }).
        when('/vendor/supplier-agreement', {
            controller: 'VendorSupplierAgreementController',
            templateUrl: getTemplateUrl('vendor/supplier-agreement.html')
        }).
        when('/vendor/:idOrSlug', {
            controller: 'ViewVendorController',
            templateUrl: getTemplateUrl('general/view-vendor.html')
        }).
        when('/user/payment-cards', {
            controller: 'UserPaymentCardsController',
            templateUrl: getTemplateUrl('user/payment-cards.html')
        }).
        when('/user/payment-cards/new', {
            controller: 'UserNewPaymentCardController',
            templateUrl: getTemplateUrl('user/new-payment-card.html')
        }).
        when('/package/deleted', {
            controller: 'DeletedPackageController',
            templateUrl: getTemplateUrl('general/deleted-package.html')
        }).
        when('/package/:humanIdAndSlug', {
            controller: 'ViewPackageController',
            templateUrl: getTemplateUrl('general/view-package.html')
        }).
        when('/meal-plan/create-account', {
            controller: 'MealPlanCreateAccountController',
            templateUrl: getTemplateUrl('auth/meal-plan-create-account.html')
        }).
        when('/admin/database-query', {
            controller: 'AdminDatabaseQueryController',
            templateUrl: getTemplateUrl('admin/database-query.html')
        }).
        when('/admin/vendors', {
            controller: 'AdminVendorsController',
            controllerAs: 'vendors',
            templateUrl: getTemplateUrl('admin/vendors.html')
        }).
        when('/admin/vendors/edit', {
            controller: 'AdminEditVendorsController',
            controllerAs: 'vendors',
            templateUrl: getTemplateUrl('admin/edit-vendors.html')
        }).
        when('/admin/vendor/:vendorId', {
            controller: 'AdminEditVendorController',
            templateUrl: getTemplateUrl('admin/edit-vendor.html')
        }).
        when('/admin/packages', {
            controller: 'AdminPackagesController',
            controllerAs: 'packages',
            templateUrl: getTemplateUrl('admin/packages.html')
        }).
        when('/admin/packages/delivery-radii', {
            controller: 'AdminEditDeliveryRadiiController',
            templateUrl: getTemplateUrl('admin/edit-delivery-radii.html')
        }).
        when('/admin/packages/edit', {
            controller: 'AdminEditPackagesController',
            controllerAs: 'packages',
            templateUrl: getTemplateUrl('admin/edit-packages.html')
        }).
        when('/admin/package/:packageId', {
            controller: 'AdminEditPackageController',
            templateUrl: getTemplateUrl('admin/edit-package.html')
        }).
        when('/admin/users', {
            controller: 'AdminUsersController',
            templateUrl: getTemplateUrl('admin/users.html')
        }).
        when('/admin/sms-centre', {
            controller: 'AdminSmsCentreController',
            templateUrl: getTemplateUrl('admin/sms-centre.html')
        }).
        when('/admin/customers', {
            controller: 'AdminCustomersController',
            templateUrl: getTemplateUrl('admin/customers.html')
        }).
        when('/admin/customer/:customerId', {
            controller: 'AdminEditCustomerController',
            templateUrl: getTemplateUrl('admin/edit-customer.html')
        }).
        when('/admin/invoices', {
            controller: 'AdminInvoicesController',
            templateUrl: getTemplateUrl('admin/invoices.html')
        }).
        when('/admin/invoice/:invoiceId', {
            controller: 'AdminViewInvoiceController',
            templateUrl: getTemplateUrl('admin/view-invoice.html')
        }).
        when('/admin/orders', {
            controller: 'AdminOrdersController',
            controllerAs: 'orders',
            templateUrl: getTemplateUrl('admin/orders.html')
        }).
        when('/admin/order/:orderId', {
            controller: 'AdminEditOrderController',
            controllerAs: 'order',
            templateUrl: getTemplateUrl('admin/edit-order.html')
        }).
        when('/admin/orders/courier', {
            controller: 'AdminCourierOrdersController',
            templateUrl: getTemplateUrl('admin/courier-orders.html')
        }).
        when('/admin/orders/stats', {
            controller: 'AdminOrdersStatsController',
            templateUrl: getTemplateUrl('admin/orders-stats.html')
        }).
        when('/admin/supplier-agreements', {
            controller: 'AdminSupplierAgreementsController',
            templateUrl: getTemplateUrl('admin/supplier-agreements.html')
        }).
        when('/admin/global-id-lookup', {
            controller: 'AdminGlobalIdLookupController',
            templateUrl: getTemplateUrl('admin/global-id-lookup.html')
        }).
        when('/admin/global-id-lookup/:id', {
            controller: 'AdminGlobalIdLookupController',
            templateUrl: getTemplateUrl('admin/global-id-lookup.html')
        }).
        when('/admin/meal-plan', {
            controller: 'AdminMealPlanDashboardController',
            templateUrl: getTemplateUrl('admin/meal-plan-dashboard.html')
        }).
        when('/admin/meal-plan/customer/:customerId/setup/preferences', {
            controller: 'AdminMealPlanSetupMealPreferencesController',
            templateUrl: getTemplateUrl('admin/meal-plan-setup-meal-preferences.html')
        }).
        when('/admin/meal-plan/customer/:customerId/setup/delivery-details', {
            controller: 'AdminMealPlanSetupDeliveryDetailsController',
            templateUrl: getTemplateUrl('admin/meal-plan-setup-delivery-details.html')
        }).
        when('/admin/meal-plan/customer/:customerId/setup/payment', {
            controller: 'AdminMealPlanSetupPaymentController',
            templateUrl: getTemplateUrl('admin/meal-plan-setup-payment.html')
        }).
        when('/admin/meal-plan/customer/:customerId/setup/request-generation', {
            controller: 'AdminMealPlanRequestGenerationController',
            templateUrl: getTemplateUrl('admin/meal-plan-request-generation.html')
        }).
        when('/admin/meal-plan/customer/:customerId/meal-plan/:mealPlanId/review', {
            controller: 'AdminMealPlanReviewController',
            templateUrl: getTemplateUrl('admin/meal-plan-review.html')
        }).
        when('/admin/meal-plan/customer/:customerId/meal-plans', {
            controller: 'AdminMealPlansController',
            templateUrl: getTemplateUrl('admin/meal-plans.html')
        }).
        when('/logout', {
            controller: () => window.location = '/logout',
            template: '<div class="wrapper">Logging out...</div>'
        }).
        otherwise({
            template: '<h1 class="wrapper">Page not found</h1>'
        });
});
