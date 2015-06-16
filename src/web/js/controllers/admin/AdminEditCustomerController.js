angular.module('cp.controllers.admin').controller('AdminEditCustomerController',
        function($scope, $routeParams, CustomersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, MealPlanFactory) {
    DocumentTitleService('Edit Customer');
    SecurityService.requireStaff();

    const copyCustomerForEditing = () => $scope.customerForEditing = angular.copy($scope.customer);

    $scope.personaOptions = CustomersFactory.getPersonaOptions();

    CustomersFactory.getCustomer($routeParams.customerId)
        .success(customer => {
            $scope.customer = customer;
            copyCustomerForEditing();
            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

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

    $scope.save = function() {
        LoadingService.show();

        const updatedCustomer = {
            persona: $scope.customerForEditing.persona
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
});
