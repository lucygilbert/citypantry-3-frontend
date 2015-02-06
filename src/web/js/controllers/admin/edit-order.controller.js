angular.module('cp.controllers.admin').controller('AdminEditOrderController',
        function($scope, $routeParams, OrdersFactory, NotificationService, addressSingleLineFormatterFilter, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Edit Order');
    SecurityService.requireStaff();

    $scope.headCountOptions = [];
    $scope.headCount = undefined;
    $scope.messages = [];
    $scope.order = {};
    $scope.vegetarianHeadCountOptions = [];
    $scope.vegetarianHeadCount = undefined;

    OrdersFactory.getOrder($routeParams.orderId)
        .success(function(order) {
            $scope.order = order;
            $scope.headCountOptions = getHeadCountOptions($scope.order.package.maxPeople, $scope.order.package.minPeople);
            $scope.headCount = $scope.order.headCount;
            $scope.vegetarianHeadCountOptions = getVegetarianHeadCountOptions($scope.order.headCount);
            $scope.vegetarianHeadCount = getVegetarianHeadCountValue($scope.order.vegetarianHeadCount);

            if ($scope.order.pickupAddress !== null) {
                $scope.order.pickupAddressString = addressSingleLineFormatterFilter($scope.order.pickupAddress);
            }

            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    OrdersFactory.getOrderMessages($routeParams.orderId)
        .success(response => $scope.messages = response.messages)
        .error(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.$watch('headCount', function(updatedHeadCount) {
        $scope.vegetarianHeadCountOptions = getVegetarianHeadCountOptions(updatedHeadCount);
        $scope.vegetarianHeadCount = getVegetarianHeadCountValue($scope.vegetarianHeadCount);
    });

    function getHeadCountOptions(maxPeople = 1, minPeople = 1) {
        if (maxPeople === null) {
            maxPeople = 1000;
        }
        if (minPeople === null) {
            minPeople = 1;
        }

        const options = [];

        for (let i = minPeople; i <= maxPeople; i += 1) {
            options.push(i);
        }

        return options;
    }

    function getVegetarianHeadCountOptions(headCount = 1) {
        const options = [];

        for (let i = 0; i <= headCount; i += 1) {
            options.push(i);
        }

        return options;
    }

    function getVegetarianHeadCountValue(vegetarianHeadCount = 0) {
        if (vegetarianHeadCount > $scope.headCount) {
            return $scope.headCount;
        }
        return vegetarianHeadCount;
    }

    $scope.save = function() {
        LoadingService.show();

        const updatedOrder = {
            requestedDeliveryDate: $scope.order.requestedDeliveryDate,
            pickupDate: $scope.order.pickupDate,
            headCount: $scope.headCount,
            vegetarianHeadCount: $scope.vegetarianHeadCount
        };

        OrdersFactory.updateOrder($routeParams.orderId, updatedOrder)
            .success(() => {
                NotificationService.notifySuccess('The order has been edited.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
