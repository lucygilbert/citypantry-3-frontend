angular.module('cp.controllers.admin').controller('AdminInvoicesController',
        function($scope, OrdersFactory, uiGridConstants, getInvoiceStatusTextFilter,
        NotificationService, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Invoices');
    SecurityService.requireStaff();

    $scope.gridOptions = {
        columnDefs: [
            {
                displayName: 'Invoice No',
                field: 'number'
            },
            {
                cellFilter: 'date:\'d MMM yyyy H:mm\'',
                displayName: 'Invoice Date',
                field: 'dateIssued',
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
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/order/{{row.entity.order.id}}">{{row.entity.order.humanId}}</a>
                    </div>
                `,
                displayName: 'Order No',
                field: 'order.humanId'
            },
            {
                cellFilter: 'date:\'d MMM yyyy H:mm\'',
                displayName: 'Order Date',
                field: 'order.date',
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
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/customer/{{row.entity.order.customer.id}}">{{row.entity.order.customerUser.name}}, {{row.entity.order.customer.company}}</a>
                    </div>
                `,
                displayName: 'Customer',
                field: 'order.customerUser.name'
            },
            {
                displayName: 'Invoice Status',
                field: 'statusTextTranslation'
            },
            {
                cellFilter: 'currency:\'£\':2',
                displayName: 'Amount',
                field: 'totalAmountAfterVoucher'
            },
            {
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/invoice/{{row.entity[col.field]}}">View</a>
                    </div>
                `,
                displayName: 'View',
                enableFiltering: false,
                field: 'id',
                name: ' '
            }
        ],
        enableFiltering: true,
        enableSorting: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25
    };

    function loadInvoices() {
        OrdersFactory.getAllCustomerInvoices().success(response => {
            angular.forEach(response.invoices, row => {
                row.statusTextTranslation = getInvoiceStatusTextFilter(row.statusText);
            });

            $scope.gridOptions.data = response.invoices;

            LoadingService.hide();
        }).error(() => NotificationService.notifyError());
    }

    loadInvoices();
});
