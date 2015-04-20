angular.module('cp').directive('cpCheckoutAddressForm', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            address: '='
        },
        controller: function($scope) {
            $scope.isAddressLabelLastFormField = true;
            $scope.isFormSubmitButtonHidden = true;
            $scope.isNew = true;
        },
        templateUrl: getTemplateUrl('directives/cp-address-form-for-customer.html'),
    };
});
