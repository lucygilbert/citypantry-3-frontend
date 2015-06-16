angular.module('cp.controllers.admin').controller('AdminOrdersController',
        function($scope, OrdersFactory, uiGridConstants, getOrderStatusTextFilter,
        getDeliveryStatusTextFilter, NotificationService, $window, DocumentTitleService,
        SecurityService, LoadingService, ClearAllButtonService, $timeout) {
    DocumentTitleService('Orders');
    SecurityService.requireStaff();

    $scope.ordersTotal = 0;

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
                field: 'customerUserAndCompanyName',
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/customer/{{row.entity.customer.id}}">{{row.entity.customerUserAndCompanyName}}</a>
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
                field: 'totalAmountAfterVoucher'
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
            // This gets every row that will be visible for the current filters
            // whether it is on the current page or not.
            $scope.gridApi.grid.rows.forEach(row => {
                if (row.visible) {
                    $scope.ordersTotal += row.entity.totalAmountAfterVoucher;
                }
            });
        }, 0);
    }

    $scope.createOrdersCsv = () => {
        const selectedOrdersIds = [];

        $scope.gridApi.grid.rows.forEach(row => {
            // The visible property marks the row as one of the filtered rows.
            // When using pagination, the row may not necessarily be visible.
            if (row.visible) {
                selectedOrdersIds.push(row.entity.id);
            }
        });

        if (selectedOrdersIds.length === 0) {
            NotificationService.notifyError('You must have at least one order to create a CSV file.');
        }

        OrdersFactory.createOrdersCsvFile(selectedOrdersIds)
            .success(response => {
                $window.location.href = response.url;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    $scope.getOrderNumbers = () => {
        $scope.visibleOrderNumbers = $scope.gridApi.core.getVisibleRows().map(order => order.entity.humanId);
    };

    function loadOrders() {
        OrdersFactory.getAllOrders().success(response => {
            angular.forEach(response.orders, row => {
                row.statusTextTranslation = getOrderStatusTextFilter(row.statusText);
                row.deliveryStatusTextTranslation = getDeliveryStatusTextFilter(row.deliveryStatus);
                row.customerUserAndCompanyName = row.customerUser.name + ', ' + row.customer.company;
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
