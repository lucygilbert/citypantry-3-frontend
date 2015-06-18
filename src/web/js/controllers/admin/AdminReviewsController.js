angular.module('cp.controllers.admin').controller('AdminReviewsController',
        function($scope, ReviewFactory, uiGridConstants, NotificationService, DocumentTitleService,
        SecurityService, LoadingService, ApiService) {
    DocumentTitleService('Reviews');
    SecurityService.requireStaff();

    $scope.gridOptions = {
        columnDefs: [
            {
                displayName: 'Order',
                field: 'orderId',
                cellTemplate: `
                    <div class="ui-grid-cell-contents">
                        <a href="/admin/order/{{row.entity[col.field]}}">View order</a>
                    </div>
                `
            },
            {
                cellFilter: 'date:\'d MMM yyyy H:mm\'',
                displayName: 'Review Date',
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
                displayName: 'Overall Rating',
                field: 'overallRating.value'
            },
            {
                displayName: 'Is Public?',
                field: 'isPublic'
            },
            {
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <a href="/admin/review/{{row.entity[col.field]}}">View</a>
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
    };

    function loadReviews() {
        ReviewFactory.getAllReviews()
            .success(response => {
                $scope.gridOptions.data = response.reviews;

                LoadingService.hide();
            })
            .error(response => NotificationService.notifyError(response.errorTranslation));
    }

    loadReviews();
});
