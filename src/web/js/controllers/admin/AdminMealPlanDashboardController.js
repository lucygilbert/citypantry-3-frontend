angular.module('cp.controllers.admin').controller('AdminMealPlanDashboardController',
        function($scope, uiGridConstants, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, CustomersFactory, getCustomerMealPlanStatusTextFilter,
        getCurrentMealPlanStatusTextFilter) {
    DocumentTitleService('Meal plan');
    SecurityService.requireStaff();

    $scope.gridOptions = {
        columnDefs: [
            {
                displayName: 'ID',
                field: 'humanId'
            },
            {
                displayName: 'Company Name',
                field: 'company',
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/customer/{{row.entity.id}}">{{row.entity.company}}</a>
                    </div>
                `
            },
            {
                displayName: 'Status',
                field: 'mealPlanStatusTextTranslation',
                filter: {
                    condition: uiGridConstants.filter.STARTS_WITH
                }
            },
            {
                displayName: 'Current Meal Plan Status',
                field: 'currentMealPlanStatusTextTranslation'
            },
            {
                cellFilter: 'date:\'d MMM yyyy H:mm\'',
                displayName: 'Last Meal Plan End Date',
                field: 'lastMealPlanEndDate',
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
                    <a ng-if="row.entity.mealPlanStatusText === 'requested_callback'" href="/admin/meal-plan/customer/{{row.entity[col.field]}}/setup">Setup</a>
                    <a ng-if="row.entity.mealPlanStatusText !== 'requested_callback'" href="@todo">Preferences</a>
                    <br />
                    <a ng-if="row.entity.mealPlanStatusText !== 'requested_callback'" href="@todo">Current</a>
                    <br />
                    <a ng-if="row.entity.mealPlanStatusText !== 'requested_callback'" href="@todo">New</a>
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

    function loadMealPlanCustomers() {
        CustomersFactory.getAllCustomers().success(response => {
            response.customers = response.customers.filter(customer => customer.mealPlanStatusText !== 'none');

            angular.forEach(response.customers, customer => {
                customer.mealPlanStatusTextTranslation = getCustomerMealPlanStatusTextFilter(customer.mealPlanStatus);
                customer.currentMealPlanStatusTextTranslation = getCurrentMealPlanStatusTextFilter(customer.currentMealPlanStatus);
            });

            $scope.gridOptions.data = response.customers;

            LoadingService.hide();
        }).error(() => NotificationService.notifyError());
    }

    loadMealPlanCustomers();

    $scope.showNewMealPlanCustomers = () => {
        const mealPlanStatusFilter = $scope.gridOptions.columnDefs[2].filter;
        mealPlanStatusFilter.term = 'Requested callback';
    };
});
