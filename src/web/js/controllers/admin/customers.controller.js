angular.module('cp.controllers.admin').controller('AdminCustomersController',
        function($scope, CustomersFactory, uiGridConstants, getPayOnAccountStatusTextFilter) {
    $scope.gridOptions = {
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
                displayName: 'Pay on Account',
                field: 'payOnAccount.statusText'
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
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <a href="/admin/customer/{{row.entity[col.field]}}">Edit</a>
                    <br />
                    <a class="pay-on-account" ng-click="grid.appScope.togglePayOnAccount(row.entity.id, row.entity.isPayOnAccount)">{{row.entity.payOnAccount.actionText}} pay on account</a>
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
    
    function loadCustomers() {
        CustomersFactory.getAllCustomers().success(response => {
            angular.forEach(response.customers, row => {
                row.payOnAccount = getPayOnAccountStatusTextFilter(row.isPayOnAccount);
            });
            $scope.gridOptions.data = response.customers;
        }).error(() => NotificationService.notifyError());
    }
    
    loadCustomers();
    
    $scope.togglePayOnAccount = function(id, isPayOnAccount) {
        var updatedCustomer = {
            isPayOnAccount: !isPayOnAccount
        };
        CustomersFactory.updateCustomer(id, updatedCustomer)
            .then(() => {
                loadCustomers();
                NotificationService.notifySuccess('The customer has been edited.');
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
