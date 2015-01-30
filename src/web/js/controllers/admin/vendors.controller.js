angular.module('cp.controllers.admin').controller('AdminVendorsController',
        function($scope, VendorsFactory, getVendorStatusTextFilter, $window, NotificationService) {
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
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <a href="/admin/vendor/{{row.entity[col.field]}}">Edit</a>
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

    function loadVendors() {
        VendorsFactory.getAllVendors().success(response => {
            angular.forEach(response.vendors, row => {
                row.activeAndApproved = getVendorStatusTextFilter(row.isActive, row.isApproved);
            });
            vm.gridOptions.data = response.vendors;
        });
    }

    loadVendors();

    $scope.delete = function(id) {
        var confirmed = $window.confirm('Are you sure?');
        if (confirmed) {
            VendorsFactory.deleteVendor(id)
                .then(loadVendors)
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
        }
    };
});
