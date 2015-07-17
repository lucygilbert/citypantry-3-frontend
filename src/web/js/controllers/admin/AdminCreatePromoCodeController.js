angular.module('cp.controllers.admin').controller('AdminCreatePromoCodeController',
        function($scope, $q, PromoCodeFactory, CustomersFactory, VendorsFactory, NotificationService,
        SecurityService, DocumentTitleService, LoadingService) {
    DocumentTitleService('Create a promo code');
    SecurityService.requireStaff();

    $scope.isFinished = false;
    $scope.promoCode = {};
    $scope.types = PromoCodeFactory.getPromoCodeTypes();
    $scope.useTypes = PromoCodeFactory.getPromoCodeUseTypes();

    const loadingPromise1 = $scope.customers = CustomersFactory.getAllCustomers()
        .success(response => $scope.customers = response.customers)
        .error(response => NotificationService.notifyError(response.errorTranslation));

    const loadingPromise2 = $scope.vendors = VendorsFactory.getAllVendors()
        .success(response => $scope.vendors = response.vendors)
        .error(response => NotificationService.notifyError(response.errorTranslation));

    $q.all([loadingPromise1, loadingPromise2])
        .then(LoadingService.hide);

    $scope.create = function() {
        if (!$scope.createForm.$valid) {
            NotificationService.notifyError('Please complete all required fields.');
            return;
        }

        const insertData = angular.copy($scope.promoCode);

        PromoCodeFactory.createPromoCode(insertData)
            .success(() => {
                $scope.isFinished = true;
                NotificationService.notifySuccess('The promo code has been created.');
                LoadingService.hide();
            })
            .error(response => NotificationService.notifyError(response.errorTranslation));
    };
});
