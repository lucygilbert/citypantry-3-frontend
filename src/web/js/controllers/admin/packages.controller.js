angular.module('cp.controllers.admin').controller('AdminPackagesController',
        function(PackagesFactory, getVendorStatusTextFilter) {
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
                displayName: 'Food Type',
                field: 'cuisineType.name'
            },
            {
                displayName: 'Vendor',
                field: 'vendor.name'
            },
            {
                cellFilter: 'currency:\'£\':2',
                displayName: 'Cost',
                field: 'costIncludingVat'
            },
            {
                displayName: 'Min People',
                field: 'minPeople'
            },
            {
                displayName: 'Max People',
                field: 'maxPeople'
            },
            {
                displayName: 'Status',
                field: 'activeAndApproved'
            },
            {
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="/admin/package/{{row.entity[col.field]}}">Edit</a></div>',
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

    PackagesFactory.getAllPackages().success(function(data) {
        angular.forEach(data.packages, function(row) {
            row.activeAndApproved = getVendorStatusTextFilter(row.active, row.approved);
        });
        vm.gridOptions.data = data.packages;
    });
});
