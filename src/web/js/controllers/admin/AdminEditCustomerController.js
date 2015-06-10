angular.module('cp.controllers.admin').controller('AdminEditCustomerController',
        function($scope, $routeParams, CustomersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, MealPlanFactory) {
    DocumentTitleService('Edit Customer');
    SecurityService.requireStaff();

    CustomersFactory.getCustomer($routeParams.customerId)
        .success(customer => {
            $scope.customer = customer;
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
                NotificationService.notifySuccess('Done -- you can set up the customer\'s meal plan preferences now.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
