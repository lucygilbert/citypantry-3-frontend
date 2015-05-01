angular.module('cp.controllers.vendor').controller('VendorSupplierAgreementController',
        function($scope, SecurityService, DocumentTitleService, LoadingService, VendorsFactory,
        $location, NotificationService) {
    SecurityService.requireVendor();
    DocumentTitleService('Supplier Agreement');

    VendorsFactory.getLatestSupplierAgreement()
        .success(response => {
            $scope.agreement = response.agreement;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

    $scope.accept = function () {
        if (!$scope.agreement.id) {
            NotificationService.notifyError('There is no agreement to accept.');
            return;
        }

        LoadingService.show();

        VendorsFactory.acceptSupplierAgreement($scope.agreement.id)
            .success(() => $location.path('/'))
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
