angular.module('cp.controllers.general').controller('VendorEditHolidayController',
        function ($scope, $routeParams, VendorsFactory, LoadingService, DocumentTitleService,
        NotificationService, SecurityService, $location) {
    DocumentTitleService('Edit holiday');
    SecurityService.requireVendor();

    VendorsFactory.getHoliday($routeParams.id)
        .success(response => {
            $scope.holiday = response.holiday;
            LoadingService.hide();
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));

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

    const isValidDateFormat = (string) => string.match(/^\d{4}-\d{2}-\d{2}$/);

    $scope.edit = function() {
        if (!($scope.start instanceof Date) || !($scope.end instanceof Date)) {
            NotificationService.notifyError('You need to enter the start and end dates.');
            return;
        }

        $scope.start = toServerDateFormat($scope.start);
        $scope.end = toServerDateFormat($scope.end);

        if (!isValidDateFormat($scope.start) || !isValidDateFormat($scope.end)) {
            NotificationService.notifyError('You need to enter the start and end dates.');
            return;
        }

        VendorsFactory.updateHoliday($routeParams.id, $scope.start, $scope.end)
            .then(() => $location.path('/vendor/holidays'))
            .catch((response) => NotificationService.notifyError(response.data.errorTranslation));
    };
});
