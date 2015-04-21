angular.module('cp.services').service('ClearAllButtonService', function() {
    return {
        addToScope(scope, gridOptions) {
            gridOptions.onRegisterApi = (gridApi) => {
                scope.clearAllFilters = () => gridApi.grid.clearAllFilters();
            };
        }
    };
});
