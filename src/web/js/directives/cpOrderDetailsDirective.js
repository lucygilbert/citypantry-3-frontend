angular.module('cp').directive('cpOrderDetails', function(getTemplateUrl) {
    return {
        restrict: 'EA',
        scope: {
            order: '=',
            isEditable: '=cpIsEditable'
        },
        templateUrl: getTemplateUrl('directives/cp-order-details.html'),
        controller: function($scope) {
            if (angular.isUndefined($scope.isEditable)) {
                $scope.isEditable = true;
            }
        }
    };
});
