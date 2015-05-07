angular.module('cp.controllers.admin').controller('AdminOrdersStatsController',
        function($scope, ApiService, DocumentTitleService, SecurityService, LoadingService,
        NotificationService, $q) {
    DocumentTitleService('Orders Stats');
    SecurityService.requireStaff();

    const may = ApiService.get('/orders/sales-in-month/2015/05').success(response => $scope.may = response);
    const april = ApiService.get('/orders/sales-in-month/2015/04').success(response => $scope.april = response);
    const march = ApiService.get('/orders/sales-in-month/2015/03').success(response => $scope.march = response);

    const loadingPromises = [may, april, march];
    $q.all(loadingPromises)
        .then(() => LoadingService.hide())
        .catch(() => NotificationService.notifyError());
});
