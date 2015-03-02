angular.module('cp.controllers.general').controller('QuoteController',
        function($scope, QuoteFactory, DocumentTitleService, LoadingService, NotificationService) {
    DocumentTitleService('Get a quote for an event');
    LoadingService.hide();

    $scope.send = function () {
        var quoteDetails = {
            name: $scope.name,
            email: $scope.email,
            tel: $scope.tel,
            purpose: $scope.purpose
        };
        LoadingService.show();

        QuoteFactory.sendQuote(quoteDetails).success(() => {
            $scope.name = '';
            $scope.email = '';
            $scope.tel = '';
            $scope.purpose = '';
            LoadingService.hide();
            NotificationService.notifySuccess('Thanks! We\'ll get back to you shortly. In the meantime, enjoy some fine reading over at our blog while you\'re still here.');
        }).catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
