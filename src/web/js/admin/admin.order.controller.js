angular.module('cp').controller('AdminOrderController',
        function(orderService) {
    var vm = this;
    
    vm.gridOptions = {
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
                cellFilter: "currency:'£':2",
                displayName: 'Amount',
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
    
    orderService.getAllOrders().success(function(data) {
        vm.gridOptions.data = data.orders;
    });
});
