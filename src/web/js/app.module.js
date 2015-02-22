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
    'cp.controllers.vendor',
    'cp.filters',
    'cp.factories',
    'cp.services',
    'uiGmapgoogle-maps'
]);

const baseHost = window.location.host.replace('order.', '');
angular.module('cp')
    .constant('FRONTEND_BASE', window.location.protocol + '//order.' + baseHost)
    .constant('API_BASE', window.location.protocol + '//api.' + baseHost)
    .constant('HUBSPOT_BASE', window.hubspotBase)
    .constant('MAP_CENTER', {
        latitude: 51.527787,
        longitude: -0.127691
    });

angular.module('cp').config(function($locationProvider, uiGmapGoogleMapApiProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    uiGmapGoogleMapApiProvider.configure({
        // @todo – use a constant for key – discuss with Amy (23/02).
        key: 'AIzaSyCgsL3Y_ku4QY06aDa6WVkIyy_E8IXPJYg',
        v: '3.17'
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
                $location.path('/logout');
            }
        });
    }
});
