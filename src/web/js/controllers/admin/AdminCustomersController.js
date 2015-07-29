angular.module('cp.controllers.admin').controller('AdminCustomersController',
        function($scope, CustomersFactory, uiGridConstants, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, getPaidOnAccountStatusTextFilter, getCustomerPersonaTextFilter,
        $window) {
    DocumentTitleService('Customers');
    SecurityService.requireStaff();

    $scope.csvFields = [
        {field: 'humanId', label: 'ID', isEnabled: true},
        {field: 'company', label: 'Company', isEnabled: true},
        {field: 'email', label: 'Email', isEnabled: true},
        {field: 'paidOnAccountStatus', label: 'Paid-on-account status', isEnabled: true},
        {field: 'isPaidOnAccount', label: 'Is paid on account?', isEnabled: true},
        {field: 'dateAdded', label: 'Date joined', isEnabled: true},
        {field: 'accountsEmail', label: 'Accounts email', isEnabled: false},
        {field: 'accountsContactName', label: 'Accounts contact name', isEnabled: false},
        {field: 'accountsTelephoneNumber', label: 'Accounts telephone number', isEnabled: false},
        {field: 'daysUntilInvoiceOverdue', label: 'Days until invoice overdue', isEnabled: false},
        {field: 'invoicePaymentTerms', label: 'Invoice payment terms', isEnabled: false},
        {field: 'maxSpendPerMonth', label: 'Max spend per month', isEnabled: false},
        {field: 'mealPlanStatus', label: 'Customer meal plan status', isEnabled: true},
        {field: 'currentMealPlanStatus', label: 'Current meal plan\'s status', isEnabled: false},
        {field: 'lastMealPlanEndDate', label: 'Last meal plan end date', isEnabled: false},
        {field: 'persona', label: 'Persona', isEnabled: true},
        {field: 'salesStaffType', label: 'Sales staff type', isEnabled: true},
        {field: 'referralCode', label: 'Referral code', isEnabled: true},
        {field: 'selfIdentifiedPersona', label: 'Self-identified persona', isEnabled: true},
        {field: 'payOnAccountInvoiceRecipient', label: 'Pay on account invoice recipient', isEnabled: false}
    ];

    let gridApi;

    /**
     * Get all rows that are currently filtered, regardless of whether they are on the currently
     * visible page.
     */
    const getAllFilteredRows = () => {
        return $scope.gridApi.grid.rows.filter(row => row.visible);
    };

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
        paginationPageSize: 25,
        onRegisterApi(gridApi) {
            $scope.gridApi = gridApi;
        }
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

    $scope.createCustomersCsv = () => {
        const selectedCustomersIds = getAllFilteredRows().map(row => row.entity.id);
        if (selectedCustomersIds.length === 0) {
            NotificationService.notifyError('You must have at least one order to create a CSV file.');
            return;
        }

        const enabledFields = $scope.csvFields.filter(field => field.isEnabled).map(field => field.field);
        if (enabledFields.length === 0) {
            NotificationService.notifyError('You must have at least one field to create a CSV file.');
            return;
        }

        CustomersFactory.createCustomersCsvFile(selectedCustomersIds, enabledFields)
            .success(response => $window.location.href = response.url)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
