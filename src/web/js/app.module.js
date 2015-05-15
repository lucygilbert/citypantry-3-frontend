angular.module('cp', [
    'cpLib',
    'cpLibIntegration',
    'checklist-model',
    'cp.controllers.admin',
    'cp.controllers.authentication',
    'cp.controllers.customer',
    'cp.controllers.general',
    'cp.controllers.user',
    'cp.controllers.vendor',
    'cp.services',
    'currencyMask',
    'ngCookies',
    'ngRoute',
    'ui.bootstrap',
    'ui.bootstrap.carousel',
    'ui.grid',
    'ui.grid.pagination',
    'uiGmapgoogle-maps',
    'uiSlider',
    'angularFileUpload',
    'js.clamp'
]);

const baseHost = window.location.host.replace('order.', '');
angular.module('cp')
    .constant('FRONTEND_BASE', window.location.protocol + '//order.' + baseHost)
    .constant('API_BASE', window.location.protocol + '//api.' + baseHost)
    .constant('HUBSPOT_BASE', window.hubspotBase)
    .constant('MAP_CENTER', {
        latitude: 51.527787,
        longitude: -0.127691
    })
    .constant('GOOGLE_MAPS_JAVASCRIPT_API_V3_KEY', window.googleMapsJavascriptApiV3Key)
    .constant('INCLUDE_ANALYTICS_JS', window.includeAnalyticsJs)
    .constant('CP_TELEPHONE_NUMBER_UK', '020 3397 8376')
    .constant('CP_TELEPHONE_NUMBER_INTERNATIONAL', '+442033978376')
    .constant('CP_SUPPORT_EMAIL_ADDRESS', 'support@citypantry.com')
    .constant('CP_POSTAL_ADDRESS', [
        'Francis House',
        '11 Francis Street',
        'Westminster',
        'London',
        'SW1P 1DE'
    ])
    .constant('CP_BANK_ACCOUNT_NUMBER', '29201632')
    .constant('CP_BANK_NAME', 'National Westminster Bank PLC')
    .constant('CP_BANK_SORT_CODE', '60-30-20')
    .constant('INVOICE_STATUS_AWAITING_PAYMENT', 1)
    .constant('INVOICE_STATUS_PAID', 2)
    .constant('getTemplateUrl', (path) => '/dist/templates/' + path + '?cacheBuster=' + window.cacheBusterValue);

angular.module('cp').config(function($locationProvider, uiGmapGoogleMapApiProvider, GOOGLE_MAPS_JAVASCRIPT_API_V3_KEY,
        $sceDelegateProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    uiGmapGoogleMapApiProvider.configure({
        key: GOOGLE_MAPS_JAVASCRIPT_API_V3_KEY,
        v: '3.17'
    });

    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'https://platform.twitter.com/**',
        '//www.facebook.com/**',
        'http://www.facebook.com/**',
        'https://www.facebook.com/**'
    ]);
})
.run(function($rootScope, HUBSPOT_BASE, LoadingService, UsersFactory, $location, $cookies) {
    $rootScope.hubspotBase = HUBSPOT_BASE;

    $rootScope.$on('$routeChangeStart', function(event, oldRoute, newRoute) {
        LoadingService.show();
    });

    $rootScope.$on('$routeChangeSuccess', function(event, oldRoute, newRoute) {
        // HubSpot tracking.
        if (window._hsq && typeof window._hsq.push === 'function') {
            window._hsq.push(['trackPageView']);
        }

        // Google Analytics tracking.
        if (window.ga && typeof window.ga === 'function') {
            window.ga('send', 'pageview', $location.url());
        }
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
})
.run(function($rootScope, CP_TELEPHONE_NUMBER_UK, CP_TELEPHONE_NUMBER_INTERNATIONAL, CP_SUPPORT_EMAIL_ADDRESS,
        INCLUDE_ANALYTICS_JS, getTemplateUrl) {
    $rootScope.CP_TELEPHONE_NUMBER_UK = CP_TELEPHONE_NUMBER_UK;
    $rootScope.CP_TELEPHONE_NUMBER_INTERNATIONAL = CP_TELEPHONE_NUMBER_INTERNATIONAL;
    $rootScope.CP_SUPPORT_EMAIL_ADDRESS = CP_SUPPORT_EMAIL_ADDRESS;
    $rootScope.INCLUDE_ANALYTICS_JS = INCLUDE_ANALYTICS_JS;
    $rootScope.getTemplateUrl = getTemplateUrl;
});
