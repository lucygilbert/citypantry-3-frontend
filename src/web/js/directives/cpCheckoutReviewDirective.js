angular.module('cp').directive('cpCheckoutReview', function(CheckoutService) {
    return {
        restrict: 'E',
        controller: function($scope) {
            $scope.deliveryCost = CheckoutService.getDeliveryCost();
            $scope.deliveryDate = CheckoutService.getDeliveryDate();
            $scope.headCount = CheckoutService.getHeadCount();
            $scope.isCutleryAndServiettesRequired = CheckoutService.isCutleryAndServiettesRequired();
            $scope.isVendorRequiredToCleanUp = CheckoutService.isVendorRequiredToCleanUp();
            $scope.isVendorRequiredToSetUp = CheckoutService.isVendorRequiredToSetUp();
            $scope.postcode = CheckoutService.getPostcode();
            $scope.subTotalAmount = CheckoutService.getSubTotalAmount();
            $scope.totalAmount = CheckoutService.getTotalAmount();
            $scope.vendorCleanupCost = CheckoutService.getVendorCleanupCost();
            $scope.vendorSetupCost = CheckoutService.getVendorSetupCost();
        },
        templateUrl: '/dist/templates/directives/cp-checkout-review.html',
    };
});
