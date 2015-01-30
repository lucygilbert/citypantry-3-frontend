angular.module('cp.controllers.admin').controller('AdminCustomersController',
        function(CustomersFactory, uiGridConstants) {
    var vm = this;

    vm.gridOptions = {
        columnDefs: [
            {
                displayName: 'ID',
                field: 'id'
            },
            {
                displayName: 'Name',
                field: 'user.name'
            },
            {
                displayName: 'Email',
                field: 'user.email'
            },
            {
                cellFilter: 'date:\'dd/MM/yyyy\'',
                displayName: 'Customer Since',
                field: 'dateAdded',
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
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="/admin/customer/{{row.entity[col.field]}}">Edit</a></div>',
                displayName: 'Action',
                field: 'id',
                name: ' ',
                enableFiltering: false
            }
        ],
        enableFiltering: true,
        enableSorting: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25
    };

    CustomersFactory.getAllCustomers().success(function(data) {
        vm.gridOptions.data = data.customers;
    });
});
