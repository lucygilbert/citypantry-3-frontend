angular.module('cp.controllers.admin').controller('AdminCourierOrdersController',
        function($scope, OrdersFactory, DocumentTitleService, SecurityService, LoadingService,
        getOrderStatusTextFilter, getDeliveryStatusTextFilter) {
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
                displayName: 'Order Status',
                field: 'statusTextTranslation'
            },
            {
                displayName: 'Delivery Status',
                field: 'deliveryStatusTextTranslation'
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

    OrdersFactory.getCourierOrders().success(response => {
        angular.forEach(response.orders, row => {
            row.statusTextTranslation = getOrderStatusTextFilter(row.statusText);
            row.deliveryStatusTextTranslation = getDeliveryStatusTextFilter(row.deliveryStatus);
        });

        $scope.gridOptions.data = response.orders;
        LoadingService.hide();
    });
});
