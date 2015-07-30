angular.module('cp.controllers.admin').controller('AdminEditCustomerController',
        function($scope, $routeParams, CustomersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, MealPlanFactory, AddressFactory) {
    SecurityService.requireStaff();

    const copyCustomerForEditing = () => $scope.customerForEditing = angular.copy($scope.customer);

    $scope.personaOptions = CustomersFactory.getPersonaOptions();
    $scope.salesStaffTypeOptions = CustomersFactory.getSalesStaffTypeOptions();
    $scope.payOnAccountInvoiceRecipientOptions = CustomersFactory.getPayOnAccountInvoiceRecipientOptions();

    CustomersFactory.getCustomer($routeParams.customerId)
        .success(customer => {
            $scope.customer = customer;
            copyCustomerForEditing();
            DocumentTitleService(`Edit customer: ${customer.company}`);
            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    function loadAddresses() {
        return AddressFactory.getAddressesByCustomerId($routeParams.customerId)
            .success(response => {
                $scope.deliveryAddresses = response.deliveryAddresses;
                $scope.billingAddresses = response.billingAddresses;
            })
            .error(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    loadAddresses();

    CustomersFactory.getCustomerReviews($routeParams.customerId)
        .success(response => $scope.reviews = response.reviews)
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.revokePaymentOnAccount = function() {
        LoadingService.show();

        CustomersFactory.revokePaymentOnAccount($routeParams.customerId)
            .success(response => {
                $scope.customer = response.customer;
                copyCustomerForEditing();
                NotificationService.notifySuccess('Payment on account has been revoked.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.addToMealPlan = function() {
        LoadingService.show();

        MealPlanFactory.addCustomerToMealPlan($routeParams.customerId)
            .success(response => {
                $scope.customer = response.customer;
                copyCustomerForEditing();
                NotificationService.notifySuccess('Done -- you can set up the customer\'s meal plan preferences now.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.updatePayOnAccountDetails = function() {
        LoadingService.show();

        const payOnAccountDetails = {
            accountsEmail: $scope.customer.accountsEmail,
            accountsContactName: $scope.customer.accountsContactName,
            accountsTelephoneNumber: $scope.customer.accountsTelephoneNumber,
            daysUntilInvoiceOverdue: $scope.customer.daysUntilInvoiceOverdue,
            maxSpendPerMonth: $scope.customer.maxSpendPerMonth,
            invoicePaymentTerms: $scope.customer.invoicePaymentTerms
        };

        createOrUpdatePayOnAccountDetails('The details have been updated.', payOnAccountDetails);
    };

    $scope.setUpRequestToPayOnAccount = function() {
        LoadingService.show();

        const payOnAccountDetails = {
            maxSpendPerMonth: $scope.customer.maxSpendPerMonth,
            invoicePaymentTerms: $scope.customer.invoicePaymentTerms
        };

        createOrUpdatePayOnAccountDetails('The request to pay on account has been set up.', payOnAccountDetails);
    };

    function createOrUpdatePayOnAccountDetails(successMessage, details) {
        CustomersFactory.createOrUpdatePayOnAccountDetails($routeParams.customerId, details)
            .success(response => {
                $scope.customer = response.customer;
                NotificationService.notifySuccess(successMessage);
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    $scope.save = function() {
        LoadingService.show();

        const updatedCustomer = {
            persona: $scope.customerForEditing.persona,
            salesStaffType: $scope.customerForEditing.salesStaffType,
            payOnAccountInvoiceRecipient: $scope.customerForEditing.payOnAccountInvoiceRecipient,
            accountsEmail: $scope.customerForEditing.accountsEmail
        };

        CustomersFactory.updateCustomer($routeParams.customerId, updatedCustomer)
            .success(response => {
                $scope.customer = response.updatedObject;
                copyCustomerForEditing();
                NotificationService.notifySuccess('The customer has been edited.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.masquerade = () => SecurityService.masqueradeAsUser($scope.customer.user.id);

    $scope.useBillingAddressForInvoicesAndReceipts = (billingAddress) => {
        LoadingService.show();

        CustomersFactory.updateCustomer(
                $scope.customer.id,
                {billingAddressForInvoicesAndReceipts: billingAddress.id}
            )
            .then(loadAddresses)
            .then(LoadingService.hide)
            .catch(NotificationService.notifyError);
    };
});
