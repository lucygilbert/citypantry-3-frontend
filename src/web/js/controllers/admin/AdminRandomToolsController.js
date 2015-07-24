angular.module('cp.controllers.admin').controller('AdminRandomToolsController',
        function($scope, DocumentTitleService, LoadingService, SecurityService, NotificationService,
        ReportingFactory, LocationFactory) {
    DocumentTitleService('Random tools');
    SecurityService.requireStaff();
    LoadingService.hide();

    $scope.inputs = {
        getCoordinatesFromPostcode: {},
        researchPostcodeForAVendor: {},
        getOrderValueStatsBetweenDates: {}
    };

    $scope.getCoordinatesFromPostcode = function() {
        const postcode = $scope.inputs.getCoordinatesFromPostcode.postcode;
        LocationFactory.getCoordinatesFromPostcode(postcode)
            .success(response => NotificationService.notifySuccess(`Longitude: ${response.longitude}, latitude: ${response.latitude}`))
            .catch(NotificationService.notifyError);
    };

    $scope.researchPostcodeForAVendor = function() {
        ReportingFactory.runPresetDatabaseQuery('research-postcode-for-a-vendor', $scope.inputs.researchPostcodeForAVendor)
            .success(response => NotificationService.notifySuccess(response))
            .catch(NotificationService.notifyError);
    };

    $scope.getOrderValueStatsBetweenDates = function() {
        ReportingFactory.runPresetDatabaseQuery('get-order-value-stats-between-dates', $scope.inputs.getOrderValueStatsBetweenDates)
            .success(response => NotificationService.notifySuccess(response))
            .catch(NotificationService.notifyError);
    };
});
