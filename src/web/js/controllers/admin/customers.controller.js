angular.module('cp.controllers.admin').controller('AdminCustomersController',
        function($scope, CustomersFactory, uiGridConstants, getPayOnAccountStatusTextFilter, NotificationService, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Customers');
    SecurityService.requireStaff();

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
                displayName: 'Paid on Account',
                field: 'isPaidOnAccountTexts.statusText'
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
                    <a href="/admin/customer/{{row.entity[col.field]}}">View</a>
                    <br />
                    <a class="pay-on-account" ng-click="grid.appScope.togglePayOnAccount(row.entity.id, row.entity.isPaidOnAccount)">{{row.entity.isPaidOnAccountTexts.actionText}} pay on account</a>
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
                row.isPaidOnAccountTexts = getPayOnAccountStatusTextFilter(row.isPaidOnAccount);
            });
            $scope.gridOptions.data = response.customers;
            LoadingService.hide();
        }).error(() => NotificationService.notifyError());
    }

    loadCustomers();

    $scope.togglePayOnAccount = function(id, isPaidOnAccount) {
        LoadingService.show();

        const updatedCustomer = {
            isPaidOnAccount: !isPaidOnAccount
        };
        CustomersFactory.updateCustomer(id, updatedCustomer)
            .then(() => {
                loadCustomers();
                NotificationService.notifySuccess('The customer has been edited.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
