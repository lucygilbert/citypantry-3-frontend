angular.module('cp.controllers.user').controller('UserPaymentCardsController',
        function($scope, UsersFactory, DocumentTitleService, SecurityService, LoadingService,
        NotificationService) {
    DocumentTitleService('Payment cards');
    SecurityService.requireLoggedIn();

    UsersFactory.getPaymentCards()
        .success(function(response) {
            $scope.cards = response.cards;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));
});
