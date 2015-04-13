angular.module('cp').directive('cpCheckoutAddressForm', function() {
    return {
        restrict: 'E',
        scope: {
            address: '='
        },
        controller: function($scope) {
            $scope.isFormSubmitButtonHidden = true;
            $scope.isNew = true;
        },
        templateUrl: '/dist/templates/directives/cp-address-form-for-customer.html',
    };
});
