angular.module('cp.controllers.admin').controller('AdminPromoCodesController',
        function($scope, PromoCodeFactory, uiGridConstants, NotificationService, SecurityService,
        DocumentTitleService, LoadingService, promoCodeTypeTextFilter, promoCodeUseTypeTextFilter) {
    DocumentTitleService('Promo codes');
    SecurityService.requireStaff();

    $scope.gridOptions = {
        columnDefs: [
            {
                displayName: 'Code',
                field: 'code'
            },
            {
                cellFilter: 'date:\'d MMM yyyy H:mm\'',
                displayName: 'Valid from',
                field: 'validFrom',
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
                ],
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 0,
                }
            },
            {
                displayName: 'Discount',
                field: 'discount',
                maxWidth: 50
            },
            {
                displayName: 'Discount type',
                field: 'typeText'
            },
            {
                displayName: 'Use type',
                field: 'useTypeText'
            },
            {
                displayName: 'Use count',
                field: 'useCount',
                maxWidth: 50
            },
            {
                displayName: 'Actions',
                cellTemplate: `<div class="ui-grid-cell-contents">
                    </div>`,
                field: 'id',
                maxWidth: 50,
                enableFiltering: false
            }
        ],
        enableFiltering: true,
        enableSorting: true,
        paginationPageSizes: [100, 200, 300],
        paginationPageSize: 100
    };

    PromoCodeFactory.getAllPromoCodes()
        .success(response => {
            $scope.gridOptions.data = response.promoCodes;

            $scope.gridOptions.data.map(promoCode => {
                promoCode.typeText = promoCodeTypeTextFilter(promoCode.type)
                promoCode.useTypeText = promoCodeUseTypeTextFilter(promoCode.useType)
            });

            LoadingService.hide();
        })
        .error(() => NotificationService.notifyError());
});
