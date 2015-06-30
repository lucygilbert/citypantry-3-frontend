angular.module('cp.services').service('FacebookAnalyticsService', function(INCLUDE_ANALYTICS_JS) {
    return {
        track(trackerId, value = 0, currency = 'GBP') {
            if (!INCLUDE_ANALYTICS_JS) {
                return;
            }
            window._fbq = window._fbq || [];
            window._fbq.push(['track', trackerId, {'value': value, 'currency': currency}]);
        }
    };
});
