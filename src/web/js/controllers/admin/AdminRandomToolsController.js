angular.module('cp.controllers.admin').controller('AdminRandomToolsController',
        function($scope, DocumentTitleService, LoadingService, SecurityService, NotificationService,
        ReportingFactory, LocationFactory) {
    DocumentTitleService('Random tools');
    SecurityService.requireStaff();
    LoadingService.hide();

    $scope.inputs = {
    };
});
