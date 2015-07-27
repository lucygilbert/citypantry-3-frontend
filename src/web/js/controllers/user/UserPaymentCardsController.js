angular.module('cp.controllers.user').controller('UserPaymentCardsController',
        function($scope, UsersFactory, DocumentTitleService, SecurityService, LoadingService,
        NotificationService) {
    DocumentTitleService('Payment cards');
    SecurityService.requireLoggedIn();

    function loadPaymentCards() {
        UsersFactory.getPaymentCards()
            .success(function(response) {
                $scope.cards = response.cards;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    loadPaymentCards();

    $scope.deletePaymentCard = (card) => {
        LoadingService.show();

        UsersFactory.deletePaymentCard(card.id)
            .then(loadPaymentCards)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
