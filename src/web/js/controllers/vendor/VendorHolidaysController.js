angular.module('cp.controllers.general').controller('VendorHolidaysController',
        function ($scope, VendorsFactory, LoadingService, DocumentTitleService, NotificationService,
        SecurityService) {
    DocumentTitleService('Your holidays');
    SecurityService.requireVendor();

    function loadHolidays() {
        VendorsFactory.getHolidays()
            .success(response => {
                $scope.holidays = response.holidays;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    }

    $scope.openStartDatePicker = function($event) {
        // Need to call these, otherwise the popup won't open (a click outside
        // of the popup closes it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isStartDatePickerOpen = true;
    };

    $scope.openEndDatePicker = function($event) {
        // Need to call these, otherwise the popup won't open (a click outside
        // of the popup closes it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isEndDatePickerOpen = true;
    };

    /**
     * Convert a Date object to a string in the format 'YYYY-MM-DD'.
     * @param  {Date}   date
     * @return {String}
     */
    const toServerDateFormat = (date) =>
        date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).substr(-2) + '-' +
        ('0' + date.getDate()).substr(-2);

    $scope.create = function() {
        if (!$scope.start) {
            NotificationService.notifyError('You need to select a starting date.');
            return;
        }
        if (!$scope.end) {
            NotificationService.notifyError('You need to select an end date.');
            return;
        }

        const start = toServerDateFormat($scope.start);
        const end = toServerDateFormat($scope.end);

        VendorsFactory.createHoliday(start, end)
            .then(() => {
                $scope.start = null;
                $scope.end = null;
                loadHolidays();
            })
            .catch((response) => NotificationService.notifyError(response.data.errorTranslation));
    };

    loadHolidays();
});
