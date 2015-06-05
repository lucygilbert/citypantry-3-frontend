angular.module('cp.controllers.customer').controller('CustomerMealPlanSuccessController',
        function($scope, $routeParams, DocumentTitleService, SecurityService, LoadingService,
        NotificationService, MealPlanFactory) {
    DocumentTitleService('Success!');
    SecurityService.requireCustomer();

    const mealPlanId = $routeParams.mealPlanId;

    MealPlanFactory.getCustomerMealPlan('me', mealPlanId)
        .success(response => {
            $scope.mealPlan = response.mealPlan;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));
});
