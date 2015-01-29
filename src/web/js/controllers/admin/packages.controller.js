angular.module('cp.controllers.admin').controller('AdminPackagesController',
        function(PackagesFactory, uiGridConstants, $filter) {
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
                cellFilter: 'getVendorStatusText',
                displayName: 'Status',
                field: 'getActiveAndApproved()'
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
            row.getActiveAndApproved = function() {
                return this.active + '-' + this.approved;
            };
        });
        vm.gridOptions.data = data.packages;
    });
});
