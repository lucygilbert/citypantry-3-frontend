angular.module('cp.controllers.admin').controller('AdminOrdersController',
        function($scope, OrdersFactory, uiGridConstants, getOrderStatusTextFilter, NotificationService, $window, DocumentTitleService, SecurityService, LoadingService) {
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
                        placeholder: 'From'
                    },
                    {
                        condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                        placeholder: 'To'
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
                        placeholder: 'From'
                    },
                    {
                        condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                        placeholder: 'To'
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
                displayName: 'Amount',
                field: 'totalAmount'
            },
            {
                displayName: 'Status',
                field: 'statusTextTranslation'
            },
            {
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <a href="/admin/order/{{row.entity[col.field]}}">View</a>
                    <br />
                    <a ng-click="grid.appScope.delete(row.entity[col.field])">Delete</a>
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

    function loadOrders() {
        OrdersFactory.getAllOrders().success(response => {
            angular.forEach(response.orders, row => row.statusTextTranslation = getOrderStatusTextFilter(row.statusText));

            vm.gridOptions.data = response.orders;

            LoadingService.hide();
        }).error(() => NotificationService.notifyError());
    }

    loadOrders();

    $scope.delete = id => {
        const confirmed = $window.confirm('Are you sure?');
        if (!confirmed) {
            return;
        }

        LoadingService.show();

        OrdersFactory.deleteOrder(id)
            .then(loadOrders)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
