angular.module('cp.controllers.customer').controller('CustomerPayOnAccountController',
        function($scope, $location, UsersFactory, CustomersFactory, DocumentTitleService, LoadingService,
        NotificationService, SecurityService) {
    DocumentTitleService('Pay on account');
    SecurityService.requireLoggedIn();

    UsersFactory.getLoggedInUser().success(response => {
        $scope.user = response;
        LoadingService.hide();
    });

    $scope.save = function (payOnAccountForm) {
        if (!payOnAccountForm.$valid) {
            return;
        }

        LoadingService.show();

        const payOnAccountDetails = {
            accountsEmail: $scope.user.customer.accountsEmail,
            accountsContactName: $scope.user.customer.accountsContactName,
            accountsTelephoneNumber: $scope.user.customer.accountsTelephoneNumber,
            invoicePaymentTerms: $scope.user.customer.invoicePaymentTerms,
            maxSpendPerMonth: $scope.user.customer.maxSpendPerMonth
        };

        CustomersFactory.updatePayOnAccountDetails(payOnAccountDetails)
            .success(response => {
                $scope.user = response;
                let notificationMessage;

                if ($scope.user.customer.hasRequestedToPayOnAccount) {
                    notificationMessage = 'Your request to pay on account has been sent.';
                    $location.hash('request_received_message');
                } else {
                    notificationMessage = 'Your pay on account details have been updated.';
                }
                NotificationService.notifySuccess(notificationMessage);

                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
