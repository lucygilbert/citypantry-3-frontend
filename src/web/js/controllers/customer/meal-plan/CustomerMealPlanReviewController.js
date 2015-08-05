angular.module('cp.controllers.customer').controller('CustomerMealPlanReviewController',
        function($scope, $routeParams, DocumentTitleService, SecurityService, LoadingService,
        NotificationService, MealPlanFactory, $location) {
    SecurityService.requireCustomer();

    DocumentTitleService('Your meal plan');

    $scope.mealPlan = null;
    $scope.isConfirmButtonEnabled = true;

    SecurityService.getCustomer().then((customer) => $scope.customer = customer);

    $scope.$on('mealPlan.review.proposedOrdersValid', () => $scope.isConfirmButtonEnabled = true);
    $scope.$on('mealPlan.review.proposedOrdersInvalid', () => $scope.isConfirmButtonEnabled = false);

    MealPlanFactory.getCustomerMealPlan('me', $routeParams.mealPlanId)
        .success(response => {
            if (response.mealPlan.statusText === 'active') {
                $location.path(`/customer/meal-plans/${$routeParams.mealPlanId}/edit-orders`);
                return;
            }

            $scope.mealPlan = response.mealPlan;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.confirm = () => {
        if (!$scope.isConfirmButtonEnabled) {
            return;
        }

        $location.path(`/customer/meal-plans/${$routeParams.mealPlanId}/confirm`);
    };
});
