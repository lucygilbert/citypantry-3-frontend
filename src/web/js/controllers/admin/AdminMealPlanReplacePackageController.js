angular.module('cp.controllers.admin').controller('AdminMealPlanReplacePackageController',
        function($scope, $routeParams, $location, DocumentTitleService, SecurityService,
        LoadingService, NotificationService, MealPlanFactory) {
    DocumentTitleService('Replace meal plan package');
    SecurityService.requireStaff();

    $scope.requestedDeliveryDate = $routeParams.requestedDeliveryDate;

    MealPlanFactory.getPossiblePackagesForRequestedDeliveryDateAction(
            $routeParams.customerId,
            $routeParams.mealPlanId,
            $scope.requestedDeliveryDate
        )
        .success(response => {
            $scope.possiblePackages = response.possiblePackages;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.replaceWithPackage = (pkg) => {
        LoadingService.show();

        MealPlanFactory.replaceWithSpecificPackage(
                $routeParams.customerId,
                $routeParams.mealPlanId,
                pkg.id,
                $routeParams.requestedDeliveryDate
            )
            .success(response => {
                $location.path(`/admin/meal-plan/customer/${$routeParams.customerId}/meal-plan/${$routeParams.mealPlanId}/review`);
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
