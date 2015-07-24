angular.module('cp.controllers.admin').controller('AdminViewInvoiceController',
        function($scope, $routeParams, OrdersFactory, NotificationService, DocumentTitleService,
        SecurityService, LoadingService) {
    DocumentTitleService('View invoice');
    SecurityService.requireStaff();

    OrdersFactory.getCustomerInvoice($routeParams.invoiceId)
        .success(invoice => {
            $scope.invoice = invoice;
            LoadingService.hide();
        })
        .error(response => NotificationService.notifyError(response.errorTranslation));
});
