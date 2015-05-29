angular.module('cp.controllers.admin').controller('AdminMealPlanReviewController',
        function($scope, $location, $routeParams, DocumentTitleService, NotificationService,
        SecurityService, LoadingService, MealPlanFactory, OrdersFactory, PackagesFactory,
        getCustomerMealPlanDurationTextFilter, dateIsBSTInEffectFilter, getPackageAvailabilityErrorTextFilter) {
    DocumentTitleService('Review meal plan');
    SecurityService.requireStaff();

    $scope.datesToDeliverOn = [];
    $scope.isSendToCustomerButtonDisabled = false;
    $scope.mealPlan = {};
    $scope.proposedOrdersPackageIsNotAvailable = [];
    $scope.reviewsSummary = {};
    $scope.selectedOrder = {};

    MealPlanFactory.getMealPlan($routeParams.customerId, $routeParams.mealPlanId)
        .success(response => {
            console.log('getMealPlan', response);
            $scope.mealPlan = response.mealPlan;

            $scope.mealPlan.requirementsAtGeneration.durationTextTranslation = getCustomerMealPlanDurationTextFilter($scope.mealPlan.requirementsAtGeneration.duration);

            if ($scope.mealPlan.proposedOrders.length > 0) {
                $scope.mealPlan.proposedOrders.forEach(order => {
                    const requestedDeliveryDate = new Date(order.requestedDeliveryDate);
                    const dateToCheckIfInBst = new Date(requestedDeliveryDate.getTime());
                    const isBst = dateIsBSTInEffectFilter(dateToCheckIfInBst);

                    const iso8601DateString = (
                        requestedDeliveryDate.getFullYear() + '-' +
                        ('0' + (requestedDeliveryDate.getMonth() + 1)).substr(-2) + '-' +
                        ('0' + requestedDeliveryDate.getDate()).substr(-2) +
                        'T' +
                        ('0' + requestedDeliveryDate.getHours()).substr(-2) + ':' +
                        ('0' + requestedDeliveryDate.getMinutes()).substr(-2) + ':' +
                        '00' +
                        (isBst ? '+01:00' : '+00:00')
                    );

                    $scope.datesToDeliverOn.push(iso8601DateString);
                });

                $scope.selected($scope.mealPlan.proposedOrders[0]);
            }

            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    function checkProposedOrdersAvailability() {
        const proposedOrders = getStructuredProposedOrdersForApiCall();

        MealPlanFactory.checkProposedOrdersAvailability($routeParams.customerId, $routeParams.mealPlanId, proposedOrders)
            .success(proposedOrdersAvailability => {
                if (proposedOrdersAvailability.allAreAvailable) {
                    MealPlanFactory.setPackageOnDate($routeParams.customerId, $routeParams.mealPlanId, proposedOrders)
                        .success(response => {
                            $scope.mealPlan.proposedOrders = response.mealPlan.proposedOrders;
                            $scope.isSendToCustomerButtonDisabled = false;
                        })
                        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

                    return;
                }

                $scope.isSendToCustomerButtonDisabled = true;

                proposedOrdersAvailability.checks.forEach(check => {
                    // Set the proposed orders' requested delivery date so the dates
                    // are shown in the correct order.
                    const index = $scope.datesToDeliverOn.indexOf(check.check.date);
                    $scope.mealPlan.proposedOrders[index].requestedDeliveryDate = $scope.datesToDeliverOn[index];

                    if (check.isAvailable === false) {
                        $scope.mealPlan.proposedOrders[index].isAvailable = false;
                        $scope.mealPlan.proposedOrders[index].availabilityErrorText = getPackageAvailabilityErrorTextFilter(check.details);
                    }
                });
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    function getStructuredProposedOrdersForApiCall() {
        const proposedOrders = [];

        $scope.mealPlan.proposedOrders.forEach((order, index) => {
            proposedOrders.push({
                packageId: order.package.id,
                date: $scope.datesToDeliverOn[index]
            });
        });

        return proposedOrders;
    }

    const loadReviews = (id) => {
        PackagesFactory.getPackageReviews(id)
            .success(response => {
                $scope.reviewsSummary = response.summary;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.selected = (order) => {
        $scope.selectedOrder = order;
        loadReviews($scope.selectedOrder.package.id);
    };

    $scope.moved = ($index) => {
        // Remove the dragged order from the array. The order has already been
        // added at the correct position by the 'dndLists' directive.
        $scope.mealPlan.proposedOrders.splice($index, 1);

        checkProposedOrdersAvailability();
    };

    $scope.replace = () => {
        if (!$scope.selectedOrder) {
            return;
        }

        LoadingService.show();

        MealPlanFactory.replacePackage($routeParams.customerId, $routeParams.mealPlanId, $scope.selectedOrder.requestedDeliveryDate)
            .success(response => {
                $scope.mealPlan.proposedOrders = response.mealPlan.proposedOrders;

                checkProposedOrdersAvailability();

                LoadingService.hide();

                if (!response.isChanged) {
                    NotificationService.notifyError('There is no available unused alternative package.');
                }
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.send = () => {
        LoadingService.show();

        MealPlanFactory.sendToCustomer($routeParams.customerId, $routeParams.mealPlanId)
            .success(response => {
                $location.path(`/admin/meal-plan`);
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
