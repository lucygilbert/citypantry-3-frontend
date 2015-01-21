angular.module('cp.controllers.admin', [
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.pagination'
]);

angular.module('cp.controllers.admin').controller('OrderController',
        function($scope, ordersFactory) {
    $scope.ordersTable = {
        columnDefs: [
            {
                displayName: 'Order No',
                field: 'id'
            },
            {
                cellFilter: "date:'d MMM yyyy H:mm'",
                displayName: 'Order Date',
                field: 'date'
            },
            {
                cellFilter: "date:'d MMM yyyy H:mm'",
                displayName: 'Delivery Date',
                field: 'requestedDeliveryDate'
            },
            {
                displayName: 'Customer',
                field: 'contactName'
            },
            {
                displayName: 'Vendor',
                field: 'package.vendor.name'
            },
            {
                displayName: 'Package',
                field: 'package.name'
            },
            {
                displayName: 'People',
                field: 'headCount'
            },
            {
                cellFilter: "currency:'£':2",
                displayName: 'Total Cost',
                field: 'totalAmount'
            },
            {
                displayName: 'Status',
                field: 'status'
            }
        ],
        enableFiltering: true,
        enableSorting: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25
    };
    
    ordersFactory.getAllOrders().success(function(data) {
        $scope.ordersTable.data = data.orders;
    });
});
