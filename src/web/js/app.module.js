angular.module('cp', [
    'ngCookies',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.pagination'
]);

angular.module('cp').constant('API_BASE', window.location.protocol + '//api.' +
    window.location.host);
