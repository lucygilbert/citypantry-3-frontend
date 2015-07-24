angular.module('cp.controllers.admin').controller('AdminOrdersStatsController',
        function($scope, ApiService, DocumentTitleService, SecurityService, LoadingService,
        NotificationService, $q) {
    DocumentTitleService('Orders stats');
    SecurityService.requireStaff();

    $scope.isReady = false;

    const loadingPromises = [
        ApiService.get('/orders/sales-in-month/2015/07').success(response => $scope.july = response),
        ApiService.get('/orders/sales-in-month/2015/06').success(response => $scope.june = response),
        ApiService.get('/orders/sales-in-month/2015/05').success(response => $scope.may = response),
        ApiService.get('/orders/sales-in-month/2015/04').success(response => $scope.april = response)
    ];

    $q.all(loadingPromises)
        .then(() => {
            $scope.isReady = true;
            LoadingService.hide();
        })
        .catch(() => NotificationService.notifyError());

    $scope.getTotalInMonth = (month) => {
        let tally = 0;
        for (let i = 0; i < month.length; i++) {
            tally += month[i].sales;
        }
        return tally;
    };
});
