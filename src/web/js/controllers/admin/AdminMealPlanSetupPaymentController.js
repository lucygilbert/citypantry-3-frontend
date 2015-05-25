angular.module('cp.controllers.admin').controller('AdminMealPlanSetupPaymentController',
        function($scope, $location, $routeParams, $q, $window, DocumentTitleService, SecurityService,
        LoadingService, NotificationService, AddressFactory, CustomersFactory, MealPlanFactory,
        CP_PAY_ON_ACCOUNT) {
    DocumentTitleService('Payment');
    SecurityService.requireLoggedIn();

    $scope.preferences = {
        accountsContactName: undefined,
        accountsEmail: undefined,
        accountsTelephoneNumber: undefined,
        departmentReference: null,
        invoicePaymentTerms: undefined,
        isPayOnAccount: false,
        maxSpendPerMonth: undefined,
        paymentTerms: undefined,
        purchaseOrderNumber: null
    };

    $scope.billingAddress = {countryName: 'United Kingdom'};
    $scope.customer = {};

    CustomersFactory.getCustomer($routeParams.customerId)
        .success(response => {
            $scope.customer = response;

            if ($scope.customer.isPaidOnAccount) {
                $scope.preferences.isPayOnAccount = true;
            }

            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.generateMealPlan = () => {
        if ($scope.mealPlanSetupForm.$invalid) {
            $scope.mealPlanSetupForm.$submitted = true;
            return;
        }

        LoadingService.show();

        let promises = [];

        const hasRequestedToPayOnAccount = $scope.preferences.isPayOnAccount && !$scope.customer.isPaidOnAccount;

        if (hasRequestedToPayOnAccount) {
            const updatedCustomer = {
                accountsContactName: $scope.preferences.accountsContactName,
                accountsEmail: $scope.preferences.accountsEmail,
                accountsTelephoneNumber: $scope.preferences.accountsTelephoneNumber
            };

            const updateCustomerPromise = CustomersFactory.updateCustomer($scope.customer.id, updatedCustomer)
                .success(response => {
                    $scope.customer = response.updatedObject;
                })
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
            promises.push(updateCustomerPromise);

            const payOnAccountDetails = {
                invoicePaymentTerms: $scope.preferences.invoicePaymentTerms,
                maxSpendPerMonth: $scope.preferences.maxSpendPerMonth
            };

            const setUpRequestToPayOnAccountPromise = CustomersFactory.setUpRequestToPayOnAccount($scope.customer.id, payOnAccountDetails)
                .success(response => {
                    $scope.customer = response.customer;
                })
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
            promises.push(setUpRequestToPayOnAccountPromise);
        }

        const createBillingAddressPromise = AddressFactory.createBillingAddress($scope.billingAddress, $scope.customer.id)
            .success(response => {
                $scope.billingAddress = response.newAddress;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));;
        promises.push(createBillingAddressPromise);

        $q.all(promises).then(() => {
            const mealPlanPreferences = {
                billingAddress: $scope.billingAddress.id,
                departmentReference: $scope.preferences.departmentReference,
                paymentTerm: $scope.preferences.isPayOnAccount ? CP_PAY_ON_ACCOUNT : $scope.preferences.paymentTerms,
                purchaseOrderNumber: $scope.preferences.purchaseOrderNumber
            };

            MealPlanFactory.updateMealPlanPreferences($scope.customer.id, mealPlanPreferences)
                .success(response => {
                    const startDate = $window.localStorage.getItem('startDate');

                    MealPlanFactory.generateMealPlan($scope.customer.id, startDate)
                        .success(response => {
                            $location.path(`/admin/meal-plan/customer/${$scope.customer.id}/review`);
                        })
                        .catch(response => NotificationService.notifyError(response.data.errorTranslation));
                })
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
        });
    };
});
