angular.module('cp').directive('cpHistoryTable', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            history: '='
        },
        templateUrl: getTemplateUrl('directives/cp-history-table.html')
    };
});
