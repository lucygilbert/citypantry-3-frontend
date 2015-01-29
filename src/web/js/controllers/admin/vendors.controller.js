angular.module('cp.controllers.admin').controller('AdminVendorsController',
        function(VendorsFactory, getVendorStatusTextFilter) {
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
                displayName: 'Status',
                field: 'activeAndApproved'
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
            row.activeAndApproved = getVendorStatusTextFilter(row.isActive, row.isApproved);
        });
        vm.gridOptions.data = data.vendors;
    });
});
