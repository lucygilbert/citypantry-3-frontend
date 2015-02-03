angular.module('cp.controllers.general').controller('NotificationModalController',
        function($scope, $rootScope) {
    $scope.isOpen = false;

    $scope.dismiss = () => $scope.isOpen = false;

    $rootScope.$on('notify', (notification, args) => {
        $scope.type = args.type;
        $scope.message = args.message;
        $scope.isOpen = true;
    });
});
