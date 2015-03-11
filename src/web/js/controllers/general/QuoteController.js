angular.module('cp.controllers.general').controller('QuoteController',
        function($scope, QuoteFactory, DocumentTitleService, LoadingService, NotificationService,
        VendorsFactory, $routeParams) {
    if ($routeParams.vendorId) {
        VendorsFactory.getVendor($routeParams.vendorId)
            .success(response => {
                $scope.vendor = response;
                DocumentTitleService(`Hire ${response.name} for an event`);
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    } else {
        DocumentTitleService('Get a quote for an event');
        LoadingService.hide();
    }

    $scope.send = function () {
        var quoteDetails = {
            name: $scope.name,
            email: $scope.email,
            tel: $scope.tel,
            purpose: $scope.purpose
        };

        if ($routeParams.vendorId) {
            quoteDetails.vendorId = $routeParams.vendorId;
        }

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
