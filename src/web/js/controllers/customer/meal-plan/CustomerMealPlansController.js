angular.module('cp.controllers.customer').controller('CustomerMealPlansController',
        function($scope, DocumentTitleService, SecurityService, LoadingService, NotificationService,
        MealPlanFactory) {
    DocumentTitleService('Your meal plans');
    SecurityService.requireCustomer();

    MealPlanFactory.getCustomerMealPlans('me')
        .success(response => {
            $scope.mealPlans = response.mealPlans;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));
});
