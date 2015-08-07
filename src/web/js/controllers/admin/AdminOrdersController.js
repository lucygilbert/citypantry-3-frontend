angular.module('cp.controllers.admin').controller('AdminOrdersController',
        function($scope, OrdersFactory, uiGridConstants, getOrderStatusTextFilter,
        getDeliveryStatusTextFilter, NotificationService, $window, DocumentTitleService,
        SecurityService, LoadingService, ClearAllButtonService, $timeout) {
    DocumentTitleService('Orders');
    SecurityService.requireStaff();

    $scope.ordersTotal = 0;

    $scope.csvFields = [
        {field: 'humanId', label: 'Order no.', isEnabled: true},
        {field: 'date', label: 'Order date', isEnabled: true},
        {field: 'requestedDeliveryDate', label: 'Delivery date', isEnabled: true},
        {field: 'customer', label: 'Customer', isEnabled: true},
        {field: 'vendor', label: 'Vendor', isEnabled: true},
        {field: 'package', label: 'Package', isEnabled: true},
        {field: 'totalAmountAfterPromoCode', label: 'Cost (inc. VAT)', isEnabled: true},
        {field: 'status', label: 'Order status', isEnabled: true},
        {field: 'deliveryStatus', label: 'Delivery status', isEnabled: true},
        {field: 'customerPersona', label: 'Customer persona', isEnabled: false},
        {field: 'customerSalesStaffType', label: 'Customer sales staff type', isEnabled: false}
    ];

    const setFiltersToSpanAllOfToday = filters => {
        const today = new Date();

        today.setHours(0);
        today.setMinutes(0);
        filters[0].term = today.toISOString();

        today.setHours(23);
        today.setMinutes(59);
        filters[1].term = today.toISOString();
    };

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
                displayName: 'Order No',
                field: 'humanId',
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 0,
                },
            },
            {
                cellFilter: 'date:\'d MMM yyyy H:mm\'',
                displayName: 'Order Date',
                field: 'date',
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
                cellFilter: 'date:\'d MMM yyyy H:mm\'',
                displayName: 'Delivery Date',
                field: 'requestedDeliveryDate',
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
                displayName: 'Customer',
                field: 'customerCompanyAndOfficeManagerName',
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/customer/{{row.entity.customer.id}}">{{row.entity.customerCompanyAndOfficeManagerName}}</a>
                    </div>
                `
            },
            {
                displayName: 'Vendor',
                field: 'package.vendor.name',
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/vendor/{{row.entity.package.vendor.id}}">{{row.entity.package.vendor.name}}</a>
                    </div>
                `
            },
            {
                displayName: 'Package',
                field: 'package.name',
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/package/{{row.entity.package.id}}">{{ row.entity.package.name }}</a>
                    </div>
                `
            },
            {
                cellFilter: 'currency:\'£\':2',
                displayName: 'Cost (inc. VAT)',
                field: 'totalAmountAfterPromoCode'
            },
            {
                displayName: 'Order Status',
                field: 'statusTextTranslation'
            },
            {
                displayName: 'Delivery Status',
                field: 'deliveryStatusTextTranslation'
            },
            {
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <a href="/admin/order/{{row.entity[col.field]}}">View</a>
                    </div>`,
                displayName: 'View',
                field: 'id',
                name: ' ',
                enableFiltering: false
            }
        ],
        enableFiltering: true,
        enableSorting: true,
        paginationPageSizes: [100, 200, 300],
        paginationPageSize: 100,
        onRegisterApi(gridApi) {
            $scope.gridApi = gridApi;
            ClearAllButtonService.addToScopeUsingGridApi($scope, gridApi);
            gridApi.core.on.filterChanged($scope, calculateTotalOrdersCost);
        }
    };

    function calculateTotalOrdersCost() {
        $timeout(function() {
            $scope.ordersTotal = 0;
            getAllFilteredRows().forEach(row => $scope.ordersTotal += row.entity.totalAmountAfterPromoCode);
        }, 0);
    }

    $scope.createOrdersCsv = () => {
        const selectedOrdersIds = getAllFilteredRows().map(row => row.entity.id);
        if (selectedOrdersIds.length === 0) {
            NotificationService.notifyError('You must have at least one order to create a CSV file.');
            return;
        }

        const enabledFields = $scope.csvFields.filter(field => field.isEnabled).map(field => field.field);
        if (enabledFields.length === 0) {
            NotificationService.notifyError('You must have at least one field to create a CSV file.');
            return;
        }

        OrdersFactory.createOrdersCsvFile(selectedOrdersIds, enabledFields)
            .success(response => {
                $window.location.href = response.url;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.getOrderNumbers = () => {
        $scope.visibleOrderNumbers = getAllFilteredRows().map(row => row.entity.humanId);
    };

    function loadOrders() {
        OrdersFactory.getAllOrders().success(response => {
            angular.forEach(response.orders, row => {
                row.statusTextTranslation = getOrderStatusTextFilter(row.statusText);
                row.deliveryStatusTextTranslation = getDeliveryStatusTextFilter(row.deliveryStatus);
                row.customerCompanyAndOfficeManagerName = row.customer.company + ', ' + row.customerUser.name;
            });

            $scope.gridOptions.data = response.orders;

            calculateTotalOrdersCost();

            LoadingService.hide();
        }).error(() => NotificationService.notifyError());
    }

    loadOrders();

    $scope.showOrdersPlacedToday = () => setFiltersToSpanAllOfToday($scope.gridOptions.columnDefs[1].filters);

    $scope.showOrdersDeliveredToday = () => setFiltersToSpanAllOfToday($scope.gridOptions.columnDefs[2].filters);
});
