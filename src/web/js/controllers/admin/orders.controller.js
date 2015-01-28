angular.module('cp.controllers.admin', []);

angular.module('cp.controllers.admin').controller('AdminOrdersController',
        function(OrdersFactory, uiGridConstants, $filter) {
    var vm = this;

    vm.gridOptions = {
        columnDefs: [
            {
                displayName: 'Order No',
                field: 'id'
            },
            {
                cellFilter: 'date:\'d MMM yyyy H:mm\'',
                displayName: 'Order Date',
                field: 'date',
                filters: [
                    {
                        condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                        placeholder: 'From'
                    },
                    {
                        condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                        placeholder: 'To'
                    }
                ]
            },
            {
                cellFilter: 'date:\'d MMM yyyy H:mm\'',
                displayName: 'Delivery Date',
                field: 'requestedDeliveryDate',
                filters: [
                    {
                        condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                        placeholder: 'From'
                    },
                    {
                        condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                        placeholder: 'To'
                    }
                ]
            },
            {
                displayName: 'Customer',
                field: 'customerUser.name'
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
                cellFilter: 'currency:\'£\':2',
                displayName: 'Amount',
                field: 'totalAmount'
            },
            {
                cellFilter: 'getStatusText',
                displayName: 'Status',
                field: 'statusText'
            },
            {
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="/admin/order/{{row.entity[col.field]}}">View</a></div>',
                displayName: 'Action',
                field: 'id',
                name: ' '
            }
        ],
        enableFiltering: true,
        enableSorting: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25
    };

    OrdersFactory.getAllOrders().success(function(data) {
        vm.gridOptions.data = data.orders;
    });
});
