angular.module('cp.controllers.admin').controller('AdminSupplierAgreementsController',
        function($scope, $q, VendorsFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService) {
    DocumentTitleService('Supplier agreements');
    SecurityService.requireStaff();

    $scope.chosenSupplierAgreement = false;

    const loadingPromise1 = VendorsFactory.getAllVendors()
        .success(response => $scope.vendors = response.vendors);

    const loadingPromise2 = VendorsFactory.getAllSupplierAgreements()
        .success(response => $scope.supplierAgreements = response.supplierAgreements);

    $q.all([loadingPromise1, loadingPromise2])
        .then(() => LoadingService.hide())
        .catch(() => NotificationService.notifyError());

    $scope.setChosen = (chosen) => {
        $scope.chosenSupplierAgreement = chosen;
    };

    $scope.hasAgreed = (vendor) => {
        return vendor.supplierAgreements.filter(agreed => agreed.id === $scope.chosenSupplierAgreement.id).length > 0;
    };
});
