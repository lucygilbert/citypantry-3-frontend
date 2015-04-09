angular.module('cpLibIntegration', ['ngCookies'])
    .constant('API_BASE', window.location.protocol + '//api.' + window.location.host.replace('order.', ''))
    .service('ApiAuthService', function($cookies) {
        return function() {
            return {
                userId: $cookies.userId,
                authToken: $cookies.salt
            };
        };
    });
