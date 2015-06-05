angular.module('cp').directive('cpReviewMealPlan', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            'mealPlan': '=cpMealPlan',
            'customerId': '=cpCustomerId'
        },
        templateUrl: getTemplateUrl('directives/cp-review-meal-plan.html'),
        controller: 'cpReviewMealPlanController'
    };
});

angular.module('cp').controller('cpReviewMealPlanController',
        function($scope, dateIsBSTInEffectFilter, MealPlanFactory, PackagesFactory,
        NotificationService, LoadingService) {
    $scope.datesToDeliverOn = [];
    $scope.reviewsSummary = {};
    $scope.selectedProposedOrder = {};

    const getStructuredProposedOrdersForApiCall = () => {
        const proposedOrders = [];

        $scope.mealPlan.proposedOrders.forEach((order, index) => {
            proposedOrders.push({
                packageId: order.package.id,
                date: $scope.datesToDeliverOn[index]
            });
        });

        return proposedOrders;
    };

    const checkProposedOrdersAvailability = () => {
        const proposedOrders = getStructuredProposedOrdersForApiCall();

        LoadingService.show();

        MealPlanFactory.checkProposedOrdersAvailability($scope.customerId, $scope.mealPlan.id, proposedOrders)
            .success(proposedOrdersAvailability => {
                if (proposedOrdersAvailability.allAreAvailable) {
                    MealPlanFactory.setPackageOnDate($scope.customerId, $scope.mealPlan.id, proposedOrders)
                        .success(response => {
                            $scope.mealPlan.proposedOrders = response.mealPlan.proposedOrders;
                            $scope.$emit('mealPlan.review.proposedOrdersValid');
                            LoadingService.hide();
                        })
                        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

                    return;
                }

                $scope.$emit('mealPlan.review.proposedOrdersInvalid');

                proposedOrdersAvailability.checks.forEach(check => {
                    // Set the proposed orders' requested delivery date so the dates
                    // are shown in the correct order.
                    const index = $scope.datesToDeliverOn.indexOf(check.check.date);
                    $scope.mealPlan.proposedOrders[index].requestedDeliveryDate = $scope.datesToDeliverOn[index];

                    if (check.isAvailable === false) {
                        $scope.mealPlan.proposedOrders[index].isAvailable = false;
                        $scope.mealPlan.proposedOrders[index].availabilityError = check.details;
                    }
                });

                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    const loadReviews = (pkg) => {
        PackagesFactory.getPackageReviews(pkg.id)
            .success(response => $scope.reviewsSummary = response.summary)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.selectOrder = (proposedOrder) => {
        $scope.selectedProposedOrder = proposedOrder;
        loadReviews($scope.selectedProposedOrder.package);
    };

    $scope.moved = ($index) => {
        // Remove the dragged order from the array. The order has already been
        // added at the correct position by the 'dndLists' directive.
        $scope.mealPlan.proposedOrders.splice($index, 1);

        checkProposedOrdersAvailability();
    };

    $scope.replace = () => {
        if (!$scope.selectedProposedOrder) {
            return;
        }

        LoadingService.show();

        MealPlanFactory.replaceWithUnusedAlternativePackage(
                $scope.customerId,
                $scope.mealPlan.id,
                {date: $scope.selectedProposedOrder.requestedDeliveryDate}
            )
            .success(response => {
                $scope.mealPlan.proposedOrders = response.mealPlan.proposedOrders;

                checkProposedOrdersAvailability();

                if (!response.isChanged) {
                    NotificationService.notifyError('There is no available unused alternative package.');
                }
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

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
});
