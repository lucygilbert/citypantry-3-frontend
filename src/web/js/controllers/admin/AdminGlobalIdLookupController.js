angular.module('cp.controllers.admin').controller('AdminGlobalIdLookupController',
        function($scope, $routeParams, $location, ApiService, NotificationService,
        DocumentTitleService, SecurityService, LoadingService) {
    DocumentTitleService('Global ID lookup');
    SecurityService.requireStaff();
    LoadingService.hide();

    $scope.id = $routeParams.id ? $routeParams.id : null;
    $scope.hasSearched = false;
    $scope.matches = [];

    $scope.changeUrl = () => {
        $location.path(`/admin/global-id-lookup/${$scope.id}`);
    };

    $scope.search = () => {
        LoadingService.show();

        ApiService.get(`/app/document/${$scope.id}`)
            .success(response => {
                $scope.matches = response.matches;
                $scope.hasSearched = true;
                LoadingService.hide();
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };

    if ($scope.id) {
        $scope.search();
    }
});
