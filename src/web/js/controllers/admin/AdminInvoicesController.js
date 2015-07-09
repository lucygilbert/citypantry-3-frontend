angular.module('cp.controllers.admin').controller('AdminInvoicesController',
        function($scope, OrdersFactory, uiGridConstants, getInvoiceStatusTextFilter,
        NotificationService, DocumentTitleService, SecurityService, LoadingService,
        getNewInvoiceStatusFilter, getPayOnAccountStatusTextFilter) {
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
                displayName: 'Paid on Account',
                field: 'isPaidOnAccountStatusText'
            },
            {
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/customer/{{row.entity.order.customer.id}}">{{row.entity.order.customerCompanyAndOfficeManagerName}}</a>
                    </div>
                `,
                displayName: 'Customer',
                field: 'order.customerCompanyAndOfficeManagerName'
            },
            {
                displayName: 'Invoice Status',
                field: 'invoiceStatusTexts.statusText'
            },
            {
                cellFilter: 'currency:\'£\':2',
                displayName: 'Amount',
                field: 'totalAmountAfterVoucher'
            },
            {
                displayName: 'Overdue?',
                field: 'isOverdueText'
            },
            {
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/invoice/{{row.entity[col.field]}}">View</a>
                        <br />
                        <a ng-if="row.entity.order.isPaidOnAccount" class="invoice-status" ng-click="grid.appScope.toggleInvoiceStatus(row.entity.id, row.entity.statusText)">Set as {{row.entity.invoiceStatusTexts.actionText}}</a>
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
        paginationPageSize: 25,
        rowHeight: 80
    };

    function loadInvoices() {
        let nowEpochTime = new Date().getTime();

        OrdersFactory.getAllCustomerInvoices().success(response => {
            angular.forEach(response.invoices, row => {
                row.invoiceStatusTexts = getInvoiceStatusTextFilter(row.statusText);
                row.isPaidOnAccountStatusText = getPayOnAccountStatusTextFilter(row.order.isPaidOnAccount);
                row.order.customerCompanyAndOfficeManagerName = row.order.customer.company + ', ' + row.order.customerUser.name;

                if (row.order.isPaidOnAccount && row.statusText === 'awaiting_payment') {
                    let overdueEpochTime = new Date(row.dateIssued).getTime() +
                        (row.order.customer.daysUntilInvoiceOverdue * 86400000);
                    row.isOverdueText = overdueEpochTime < nowEpochTime ? 'Yes' : 'No';
                } else {
                    row.isOverdueText = 'N/A';
                }
            });

            $scope.gridOptions.data = response.invoices;

            LoadingService.hide();
        }).error(() => NotificationService.notifyError());
    }

    loadInvoices();

    $scope.toggleInvoiceStatus = function(id, status) {
        LoadingService.show();

        const newStatus = getNewInvoiceStatusFilter(status);

        OrdersFactory.updateCustomerInvoiceStatus(id, newStatus)
            .then(() => {
                loadInvoices();
                NotificationService.notifySuccess('The invoice has been updated.');
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
