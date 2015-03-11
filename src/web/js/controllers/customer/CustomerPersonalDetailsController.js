angular.module('cp.controllers.customer').controller('CustomerPersonalDetailsController',
        function($scope, UsersFactory, CustomersFactory, DocumentTitleService, LoadingService,
        NotificationService, SecurityService) {
    DocumentTitleService('My details');
    SecurityService.requireLoggedIn();

    UsersFactory.getLoggedInUser().success(response => {
        $scope.user = response;
        LoadingService.hide();
    });

    $scope.save = function () {
        if (!$scope.detailsForm.$valid) {
            $scope.detailsForm.$submitted = true;
            return;
        }

        LoadingService.show();

        var attributes = {
            name: $scope.user.user.name,
            email: $scope.user.user.email,
            company: $scope.user.customer.company
        };
        CustomersFactory.updateSelf(attributes).
            success(response => {
                $scope.user = response;
                NotificationService.notifySuccess('Your personal information has been updated.');
                LoadingService.hide();
            }).catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
