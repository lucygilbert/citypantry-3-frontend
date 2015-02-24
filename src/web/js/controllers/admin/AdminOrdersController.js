angular.module('cp.controllers.admin').controller('AdminOrdersController',
        function($scope, OrdersFactory, uiGridConstants, getOrderStatusTextFilter,
        getDeliveryStatusTextFilter, NotificationService, $window, DocumentTitleService,
        SecurityService, LoadingService) {
    DocumentTitleService('Orders');
    SecurityService.requireStaff();

    var vm = this;

    vm.gridOptions = {
        columnDefs: [
            {
                displayName: 'Order No',
                field: 'humanId'
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
                field: 'customerUser.name',
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/customer/{{row.entity.customer.id}}">{{row.entity.customerUser.name}}, {{row.entity.customer.company}}</a>
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
                field: 'package.name'
            },
            {
                cellFilter: 'currency:\'£\':2',
                displayName: 'Cost',
                field: 'totalAmount'
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
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25
    };

    function loadOrders() {
        OrdersFactory.getAllOrders().success(response => {
            angular.forEach(response.orders, row => {
                row.statusTextTranslation = getOrderStatusTextFilter(row.statusText);
                row.deliveryStatusTextTranslation = getDeliveryStatusTextFilter(row.deliveryStatus);
            });

            vm.gridOptions.data = response.orders;

            LoadingService.hide();
        }).error(() => NotificationService.notifyError());
    }

    loadOrders();

    $scope.showOrdersPlacedToday = () => setFiltersToSpanAllOfToday(this.gridOptions.columnDefs[1].filters);

    $scope.showOrdersDeliveredToday = () => setFiltersToSpanAllOfToday(this.gridOptions.columnDefs[2].filters);

    const setFiltersToSpanAllOfToday = filters => {
        const today = new Date();

        today.setHours(0);
        today.setMinutes(0);
        filters[0].term = today.toISOString();

        today.setHours(23);
        today.setMinutes(59);
        filters[1].term = today.toISOString();
    };
});
