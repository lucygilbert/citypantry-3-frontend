angular.module('cp').directive('cpHistoryTable', function() {
    return {
        restrict: 'E',
        scope: {
            history: '='
        },
        templateUrl: '/dist/templates/directives/cp-history-table.html'
    };
});
