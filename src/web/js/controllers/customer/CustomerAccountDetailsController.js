angular.module('cp.controllers.customer', []);

angular.module('cp.controllers.customer').controller('CustomerAccountDetailsController', function($scope, $q,
        DocumentTitleService, LoadingService, SecurityService, AddressFactory, CustomersFactory, UsersFactory,
        NotificationService) {
    DocumentTitleService('Account details');
    SecurityService.requireLoggedIn();
    $scope.showEditDetailsForm = false;

    const loadingPromise1 = UsersFactory.getLoggedInUser()
        .success(response => {
            $scope.authUser = response;
            // Use angular.copy because the inputs need to reset to the database's version of the details if Cancel is clicked.
            $scope.inputs = angular.copy(response);
        });

    const loadingPromise2 = AddressFactory.getAddresses()
        .success(response => $scope.addresses = response.addresses)
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    const loadingPromise3 = UsersFactory.getPaymentCards()
        .success(response => $scope.paymentCards = response.cards)
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $q.all([loadingPromise1, loadingPromise2, loadingPromise3]).then(() => LoadingService.hide());

    $scope.save = () => {
        LoadingService.show();

        var updateDetails = {
            name: $scope.inputs.user.name,
            email: $scope.inputs.user.email,
            company: $scope.inputs.customer.company
        };

        CustomersFactory.updateSelf(updateDetails).success(() => {
            UsersFactory.getLoggedInUser().success(response => {
                $scope.authUser = response;
                // See comment above about why we are using angular.copy() here.
                $scope.inputs = angular.copy(response);
                LoadingService.hide();
            });
            $scope.showEditDetailsForm = false;
        })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.cancel = () => {
        $scope.showEditDetailsForm = false;
        // See comment above about why we are using angular.copy() here.
        $scope.inputs = angular.copy($scope.authUser);
    };
});
