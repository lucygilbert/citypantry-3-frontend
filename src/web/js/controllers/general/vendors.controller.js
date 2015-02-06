angular.module('cp.controllers.general').controller('VendorsController',
        function($scope, VendorsFactory, NotificationService, DocumentTitleService, SecurityService) {
    DocumentTitleService('Meet the vendors');
    SecurityService.requireLoggedIn();

    VendorsFactory.getAllActiveAndApprovedVendors()
        .success(response => {
            response.sort((a, b) => a.name.localeCompare(b.name));
            $scope.vendors = response;
        })
        .catch(response => NotificationService.notifyError(response.data.errorTranslation));
});
