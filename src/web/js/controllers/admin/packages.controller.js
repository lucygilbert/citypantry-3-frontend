angular.module('cp.controllers.admin').controller('AdminPackagesController',
        function($scope, PackagesFactory, getVendorStatusTextFilter, $window, NotificationService, DocumentTitleService, SecurityService) {
    DocumentTitleService('Packages');
    SecurityService.requireStaff();

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
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <a href="/admin/package/{{row.entity[col.field]}}">Edit</a>
                    /
                    <a ng-click="grid.appScope.delete(row.entity[col.field])">Delete</a>
                    </div>`,
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

    function loadPackages() {
        PackagesFactory.getAllPackages().success(response => {
            angular.forEach(response.packages, row => row.activeAndApproved = getVendorStatusTextFilter(row.active, row.approved));

            vm.gridOptions.data = response.packages;
        }).error(() => NotificationService.notifyError());
    }

    loadPackages();

    $scope.delete = function(id) {
        var confirmed = $window.confirm('Are you sure?');
        if (confirmed) {
            PackagesFactory.deletePackage(id)
                .then(loadPackages)
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
        }
    };
});
