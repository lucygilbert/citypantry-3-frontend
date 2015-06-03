angular.module('cp.controllers.admin').controller('AdminMealPlanRequestGenerationController',
        function($scope, $routeParams, $location, DocumentTitleService, SecurityService,
        LoadingService, NotificationService, MealPlanFactory) {
    DocumentTitleService('New meal plan');
    SecurityService.requireStaff();

    $scope.startDate = null;

    MealPlanFactory.getCustomerMealPlanRequirements($routeParams.customerId)
        .success(response => {
            $scope.isDetailedEnoughToGenerateMealPlan = response.requirements.isDetailedEnoughToGenerateMealPlan;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.openDatePicker = $event => {
        // Need to call these, otherwise the pop-up won't open (a click outside of the pop-up closes
        // it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isDatePickerOpen = true;
    };

    $scope.requestGeneration = () => {
        if (!($scope.startDate instanceof Date)) {
            NotificationService.notifyError('Select a start date.');
            return;
        }

        LoadingService.show();

        MealPlanFactory.generateMealPlan($routeParams.customerId, $scope.startDate.toISOString())
            .success(response => {
                NotificationService.notifySuccess('A meal plan will be generated. sales@citypantry.com will be emailed when it is ready.');
                $location.path(`/admin/meal-plan`);
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
