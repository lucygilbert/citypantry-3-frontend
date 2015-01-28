angular.module('cp', [
    'ngCookies',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.pagination',
    'cp.controllers.admin',
    'cp.controllers.general',
    'cp.controllers.user',
    'cp.filters',
    'cp.factories',
]);

angular.module('cp').constant('API_BASE', window.location.protocol + '//api.' +
    window.location.host);
