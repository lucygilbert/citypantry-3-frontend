angular.module('cp.controllers.admin').controller('AdminRandomToolsController',
        function($scope, DocumentTitleService, LoadingService, SecurityService, NotificationService,
        ReportingFactory, LocationFactory) {
    DocumentTitleService('Random tools');
    SecurityService.requireStaff();
    LoadingService.hide();

    $scope.inputs = {
        getCoordinatesFromPostcode: {}
    };

    $scope.getCoordinatesFromPostcode = function() {
        const postcode = $scope.inputs.getCoordinatesFromPostcode.postcode;
        LocationFactory.getCoordinatesFromPostcode(postcode)
            .success(response => NotificationService.notifySuccess(`Longitude: ${response.longitude}, latitude: ${response.latitude}`))
            .catch(NotificationService.notifyError);
    };
});
