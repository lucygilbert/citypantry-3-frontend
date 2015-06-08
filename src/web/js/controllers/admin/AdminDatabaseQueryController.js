angular.module('cp.controllers.admin').controller('AdminDatabaseQueryController',
        function($scope, DocumentTitleService, LoadingService, SecurityService, NotificationService,
        ApiService, ReportingFactory) {
    DocumentTitleService('Database query');
    SecurityService.requireStaff();
    LoadingService.hide();

    $scope.sendQuery = () => {
        LoadingService.show();

        const config = {
            // Angular will try to parse responses as JSON by default. The response from this
            // API can be in any format, so turn off the JSON parsing,
            transformResponse: [function(responseContent) {
                return responseContent;
            }]
        };

        ReportingFactory.queryDatabase($scope.query)
            .success((response) => {
                $scope.output = response;
                LoadingService.hide();
            })
            .catch((response) => {
                NotificationService.notifyError(response.data.errorTranslation);
            });
    };
});
