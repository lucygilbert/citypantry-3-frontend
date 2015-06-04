angular.module('cp.controllers.admin').controller('AdminMealPlanReviewController',
        function($scope, $location, $routeParams, DocumentTitleService, NotificationService,
        SecurityService, LoadingService, MealPlanFactory) {
    DocumentTitleService('Review meal plan');
    SecurityService.requireStaff();

    $scope.mealPlan = null;
    $scope.customerId = $routeParams.customerId;
    $scope.isSendToCustomerButtonEnabled = true;

    SecurityService.getCustomer().then((customer) => $scope.customer = customer);

    $scope.$on('mealPlan.review.proposedOrdersValid', () => $scope.isSendToCustomerButtonEnabled = true);
    $scope.$on('mealPlan.review.proposedOrdersInvalid', () => $scope.isSendToCustomerButtonEnabled = false);

    MealPlanFactory.getCustomerMealPlan($routeParams.customerId, $routeParams.mealPlanId)
        .success(response => {
            $scope.mealPlan = response.mealPlan;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.send = () => {
        LoadingService.show();

        MealPlanFactory.sendToCustomer($routeParams.customerId, $routeParams.mealPlanId)
            .success(response => $location.path(`/admin/meal-plan`))
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
