angular.module('cp.controllers.user').controller('UserNewPaymentCardController',
        function($scope, $location, UsersFactory, DocumentTitleService, SecurityService, LoadingService,
        NotificationService) {
    DocumentTitleService('Add a new card');
    SecurityService.requireLoggedIn();
    LoadingService.hide();

    const thisYear = (new Date()).getFullYear();
    $scope.yearOptions = [];
    for (let year = thisYear; year < thisYear + 10; year++) {
        $scope.yearOptions.push({label: year, value: year});
    }

    $scope.monthOptions = [];
    for (let month = 1; month <= 12; month++) {
        $scope.monthOptions.push({label: ('0' + month).slice(-2), value: ('0' + month).slice(-2)});
    }

    $scope.card = {};

    $scope.save = function() {
        if (!$scope.paymentCardForm.$valid) {
            return;
        }

        LoadingService.show();

        UsersFactory.addPaymentCard($scope.card)
            .success(function(response) {
                NotificationService.notifySuccess('Your new card has been added successfully.');
                $location.path('/user/payment-cards');
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
