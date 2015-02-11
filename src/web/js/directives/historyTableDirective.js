angular.module('cp').directive('historyTable', function() {
    return {
        restrict: 'E',
        scope: {
            history: '='
        },
        templateUrl: '/dist/templates/directives/history-table.html'
    };
});
