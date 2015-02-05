angular.module('cp', [
    'ngCookies',
    'ngRoute',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.pagination',
    'cp.controllers.admin',
    'cp.controllers.general',
    'cp.controllers.user',
    'cp.filters',
    'cp.factories',
    'cp.services'
]);

const baseHost = window.location.host.replace('order.', '');
angular.module('cp')
    .constant('FRONTEND_BASE', window.location.protocol + '//order.' + baseHost)
    .constant('API_BASE', window.location.protocol + '//api.' + baseHost)
    .constant('HUBSPOT_BASE', window.hubspotBase);

angular.module('cp').config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
})
.run(function($rootScope, HUBSPOT_BASE) {
    $rootScope.hubspotBase = HUBSPOT_BASE;
});
