angular.module('cp.controllers.admin').controller('AdminCustomersController',
        function($scope, CustomersFactory, uiGridConstants, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, getPaidOnAccountStatusTextFilter, getCustomerPersonaTextFilter) {
    DocumentTitleService('Customers');
    SecurityService.requireStaff();

    $scope.gridOptions = {
        columnDefs: [
            {
                displayName: 'ID',
                field: 'humanId',
                maxWidth: 70
            },
            {
                displayName: 'Name',
                field: 'user.name'
            },
            {
                displayName: 'Company',
                field: 'company'
            },
            {
                displayName: 'Email',
                field: 'user.email'
            },
            {
                displayName: 'Pay on Account?',
                field: 'paidOnAccountStatusText',
            },
            {
                displayName: 'Persona',
                field: 'personaText',
            },
            {
                cellFilter: 'date:\'dd/MM/yyyy\'',
                displayName: 'Customer Since',
                field: 'dateAdded',
                filters: [
                    {
                        condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                        placeholder: 'From',
                        flags: { date: true }
                    },
                    {
                        condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                        placeholder: 'To',
                        flags: { date: true }
                    }
                ]
            },
            {
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <a href="/admin/customer/{{row.entity[col.field]}}">View</a>
                    </div>`,
                displayName: 'Action',
                field: 'id',
                name: ' ',
                enableFiltering: false,
                maxWidth: 85
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
                row.paidOnAccountStatusText = getPaidOnAccountStatusTextFilter(row.paidOnAccountStatus);
                row.personaText = getCustomerPersonaTextFilter(row.persona);
            });
            $scope.gridOptions.data = response.customers.sort((a, b) => a.humanId < b.humanId);
            LoadingService.hide();
        }).error(() => NotificationService.notifyError());
    }

    loadCustomers();
});
