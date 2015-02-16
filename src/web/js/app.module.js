angular.module('cp', [
    'ngCookies',
    'ngRoute',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.pagination',
    'uiSlider',
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

    $rootScope.$on('$routeChangeStart', function(event, oldRoute, newRoute) {
        // Don't show the loading service animation when the page change is just the search query
        // changing. It's not pretty when typing fast and the animation flickers with each key press.
        let isFromSearchToSearch = oldRoute.$route && oldRoute.$route.controller === 'SearchController' &&
            newRoute.$route && newRoute.$route.controller === 'SearchController';
        if (isFromSearchToSearch) {
            return;
        }

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
                localStorage.removeItem('user');
                $location.path('/logout');
            }
        });
    }
});
