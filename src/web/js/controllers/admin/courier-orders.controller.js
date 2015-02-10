angular.module('cp.controllers.admin').controller('AdminCourierOrdersController',
        function($scope, OrdersFactory, DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Courier Orders');
    SecurityService.requireStaff();

    $scope.gridOptions = {
        columnDefs: [
            {
                displayName: 'Order No.',
                field: 'humanId'
            },
            {
                displayName: 'Delivery Date',
                field: 'requestedDeliveryDate',
                cellFilter: 'date:\'dd/MM/yy H:mm\''
            },
            {
                displayName: 'Pickup Time',
                field: 'pickupDate',
                enableFiltering: false,
                cellFilter: 'date:\'H:mm\''
            },
            {
                displayName: 'Food Left Kitchen',
                field: 'leftKitchenDate',
                enableFiltering: false,
                cellFilter: 'date:\'H:mm\''
            },
            {
                displayName: 'Collected',
                field: 'kitchenCourierDate',
                enableFiltering: false,
                cellFilter: 'date:\'H:mm\''
            },
            {
                displayName: 'Delivered',
                field: 'actualDeliveryDate',
                enableFiltering: false,
                cellFilter: 'date:\'H:mm\''
            },
            {
                displayName: 'Courier Ref No',
                field: 'pickupReferenceNumber'
            },
            {
                displayName: 'Status',
                field: 'statusText'
            },
            {
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <a href="/admin/order/{{row.entity[col.field]}}">View/edit order</a>
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

    function getOrderStatusText(order) {
        if (order.status === 1 && order.pickupReferenceNumber === null) {
            return 'Pending courier approval';
        } else if (order.status === 1 && typeof order.pickupReferenceNumber === 'string') {
            return 'Pending vendor approval';
        } else if (order.actualDeliveryDate !== null) {
            return 'Delivered';
        } else if (order.leftKitchenDate !== null) {
            return 'Left kitchen';
        } else if (order.kitchenCourierDate !== null) {
            return 'Collected';
        } else {
            console.log('Unknown status text for order: ', order);
            return 'Unknown';
        }
    }

    OrdersFactory.getCourierOrders().success(response => {
        response.orders.map(order => order.statusText = getOrderStatusText(order));
        $scope.gridOptions.data = response.orders;
        LoadingService.hide();
    });
});
