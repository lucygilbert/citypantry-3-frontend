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
.run(function($rootScope, HUBSPOT_BASE, LoadingService, UsersFactory, $location, $cookies) {
    $rootScope.hubspotBase = HUBSPOT_BASE;

    $rootScope.$on('$routeChangeStart', function() {
        LoadingService.show();
    });

    $rootScope.$on('$routeChangeError', function () {
        LoadingService.hide();
    });

    var isLoggedIn = $cookies.userId && $cookies.salt;
    if (isLoggedIn) {
        UsersFactory.getLoggedInUser().catch(function(response) {
            if (response.status === 401) {
                // The user's ID or auth token is no longer valid. This is possibly because this is
                // a dev or staging site and the database fixtures have been reloaded.
                delete $cookies.userId;
                delete $cookies.salt;
                $location.path('/logout');
            }
        });
    }
});
