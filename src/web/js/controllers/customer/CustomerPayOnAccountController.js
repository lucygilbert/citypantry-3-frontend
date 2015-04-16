angular.module('cp.controllers.customer').controller('CustomerPayOnAccountController',
        function($scope, $location, UsersFactory, CustomersFactory, DocumentTitleService, LoadingService,
        NotificationService, SecurityService) {
    DocumentTitleService('Pay on account');
    SecurityService.requireLoggedIn();

    const setScopeStatus = () => $scope.status = $scope.user.customer.paidOnAccountStatus;

    UsersFactory.getLoggedInUser()
        .success(response => {
            $scope.user = response;
            setScopeStatus();
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.save = function (payOnAccountForm) {
        if (!payOnAccountForm.$valid) {
            return;
        }

        LoadingService.show();

        const payOnAccountDetails = {
            accountsEmail: $scope.user.customer.accountsEmail,
            accountsContactName: $scope.user.customer.accountsContactName,
            accountsTelephoneNumber: $scope.user.customer.accountsTelephoneNumber
        };

        var originalStatus = $scope.status;

        CustomersFactory.updatePayOnAccountDetails(payOnAccountDetails)
            .success(response => {
                $scope.user = response;
                setScopeStatus();

                let notificationMessage;
                if (originalStatus === 1 && $scope.status === 2) {
                    notificationMessage = 'You are now approved to pay on account.';
                } else {
                    notificationMessage = 'Your pay on account details have been updated.';
                }
                NotificationService.notifySuccess(notificationMessage);

                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
