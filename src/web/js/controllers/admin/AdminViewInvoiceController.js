angular.module('cp.controllers.admin').controller('AdminViewInvoiceController',
        function($scope, $routeParams, OrdersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, CP_TELEPHONE_NUMBER_UK, CP_SUPPORT_EMAIL_ADDRESS,
        CP_POSTAL_ADDRESS, CP_BANK_ACCOUNT_NUMBER, CP_BANK_NAME, CP_BANK_SORT_CODE) {
    DocumentTitleService('View Invoice');
    SecurityService.requireStaff();

    $scope.bankAccountNumber = CP_BANK_ACCOUNT_NUMBER;
    $scope.bankName = CP_BANK_NAME;
    $scope.bankSortCode = CP_BANK_SORT_CODE;
    $scope.phoneNumberUk = CP_TELEPHONE_NUMBER_UK;
    $scope.postalAddress = CP_POSTAL_ADDRESS;
    $scope.supportEmailAddress = CP_SUPPORT_EMAIL_ADDRESS;

    OrdersFactory.getCustomerInvoice($routeParams.invoiceId)
        .success(invoice => {
            $scope.invoice = invoice;
            LoadingService.hide();
        })
        .error(() => NotificationService.notifyError());
});
