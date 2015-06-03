angular.module('cp.controllers.admin').controller('AdminMealPlansController',
        function($scope, $q, $routeParams, DocumentTitleService, SecurityService, LoadingService,
        NotificationService, CustomersFactory, MealPlanFactory) {
    DocumentTitleService('Customer meal plans');
    SecurityService.requireLoggedIn();

    const initPromises = [];

    initPromises[0] = CustomersFactory.getCustomer($routeParams.customerId)
        .success(response => $scope.customer = response)
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    initPromises[1] = MealPlanFactory.getCustomerMealPlans($routeParams.customerId)
        .success(response => $scope.mealPlans = response.mealPlans)
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $q.all(initPromises).then(() => LoadingService.hide());
});
