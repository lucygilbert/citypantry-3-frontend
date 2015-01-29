angular.module('cp.controllers.admin').controller('AdminVendorsController',
        function(VendorsFactory, uiGridConstants, $filter) {
    var vm = this;

    vm.gridOptions = {
        columnDefs: [
            {
                displayName: 'ID',
                field: 'id'
            },
            {
                displayName: 'Name',
                field: 'name'
            },
            {
                displayName: 'Email',
                field: 'vendorUsers[0].user.email'
            },
            {
                displayName: 'Telephone',
                field: 'addresses[0].telephoneNumber'
            },
            {
                displayName: 'Business Type',
                field: 'businessType.name'
            },
            {
                cellFilter: 'getVendorStatusText',
                displayName: 'Status',
                field: 'getActiveAndApproved()'
            },
            {
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="/admin/vendor/{{row.entity[col.field]}}">Edit</a></div>',
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

    VendorsFactory.getAllVendors().success(function(data) {
        angular.forEach(data.vendors, function(row) {
            row.getActiveAndApproved = function() {
                return this.isActive + '-' + this.isApproved;
            };
        });
        vm.gridOptions.data = data.vendors;
    });
});
