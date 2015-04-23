angular.module('cp').directive('cpHistoryTable', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            documentId: '=',
            documentType: '@'
        },
        templateUrl: getTemplateUrl('directives/cp-history-table.html'),
        controller: 'cpHistoryTableController'
    };
});

angular.module('cp').controller('cpHistoryTableController',
        function($scope, ApiService, NotificationService) {
    $scope.isLoaded = false;

    function load() {
        if (!$scope.documentId || !$scope.documentType) {
            return;
        }

        ApiService.get(`/history/document?documentId=${$scope.documentId}&documentType=${$scope.documentType}`)
            .success(response => {
                $scope.history = response.history;
                $scope.isLoaded = true;
            })
            .catch(response => NotificationService.notifyError('There was an error loading the history for this document.'));
    }

    $scope.$watch('documentId', load);

    load();
});
