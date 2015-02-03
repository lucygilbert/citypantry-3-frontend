angular.module('cp.controllers.admin').controller('AdminEditOrderController',
        function($scope, $routeParams, OrdersFactory, NotificationService) {
    $scope.headCountOptions = [];
    $scope.headCount;
    $scope.messages = [];
    $scope.order = {};
    $scope.save = save;
    $scope.vegetarianHeadCountOptions = [];
    $scope.vegetarianHeadCount;
    
    init();
    
    function init() {
        OrdersFactory.getOrder($routeParams.orderId)
            .success(function(order) {
                $scope.order = order;
                $scope.headCountOptions = getHeadCountOptions($scope.order.package.maxPeople, $scope.order.package.minPeople);
                $scope.headCount = setHeadCountSelect($scope.order.headCount, $scope.headCountOptions);
                $scope.vegetarianHeadCountOptions = getVegetarianHeadCountOptions($scope.order.headCount);
                $scope.vegetarianHeadCount = setVegetarianHeadCountSelect($scope.order.vegetarianHeadCount, $scope.vegetarianHeadCountOptions);
            })
            .error(response => NotificationService.notifyError(response.data.errorTranslation));
        
        OrdersFactory.getOrderMessages($routeParams.orderId)
            .success(response => $scope.messages = response.messages)
            .error(response => NotificationService.notifyError(response.data.errorTranslation));
        
        $scope.$watch('headCount', function(updatedHeadCount) {
            $scope.vegetarianHeadCountOptions = getVegetarianHeadCountOptions(updatedHeadCount);
            $scope.vegetarianHeadCount = setVegetarianHeadCountSelect($scope.vegetarianHeadCount, $scope.vegetarianHeadCountOptions);
        });
    }
    
    function getHeadCountOptions(maxPeople, minPeople) {
        var options = [];
        var i;
        var maxPeople = maxPeople || 1;
        var minPeople = minPeople || 1;
        
        for (i = minPeople; i <= maxPeople; i += 1) {
            options.push(i);
        }
        
        return options;
    }
    
    function getVegetarianHeadCountOptions(headCount) {
        var headCount = headCount || 1;
        var i;
        var options = [];
        
        for (i = 1; i <= headCount; i += 1) {
            options.push(i);
        }
        
        return options;
    }
    
    function setHeadCountSelect(headCount, options) {
        var headCountIndex;
        var headCount = headCount || 1;
        var options = options || [];
        
        headCountIndex = options.indexOf(headCount);
        return options[headCountIndex];
    }
    
    function setVegetarianHeadCountSelect(vegetarianHeadCount, options) {
        var options = options || [];
        var vegetarianHeadCountIndex;
        var vegetarianHeadCount = vegetarianHeadCount || 0;
        
        vegetarianHeadCountIndex = options.indexOf(vegetarianHeadCount);
        return options[vegetarianHeadCountIndex];
    }
    
    function save() {
        var updatedOrder = {
            date: $scope.order.date,
            headCount: $scope.headCount,
            pickupDate: $scope.order.pickupDate,
            vegetarianHeadCount: $scope.vegetarianHeadCount
        };
        OrdersFactory.updateOrder($routeParams.orderId, updatedOrder)
            .success(() => NotificationService.notifySuccess('The order has been edited.'))
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }
});
