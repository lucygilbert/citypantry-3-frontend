angular.module('cpLibIntegration', ['ngCookies'])
    .constant('API_BASE', window.location.protocol + '//api.' + window.location.host.replace('order.', ''))
    .service('ApiAuthService', function($cookies) {
        return {
            getAuthHeaders() {
                return {
                    userId: $cookies.userId,
                    authToken: $cookies.salt
                };
            },

            getExtraHeaders() {
                if ($cookies.staffMasqueraderId && typeof $cookies.staffMasqueraderId === 'string' &&
                        $cookies.staffMasqueraderId.length === 24) {
                    return {
                        'X-CityPantry-StaffMasqueraderId': $cookies.staffMasqueraderId
                    };
                } else {
                    return {};
                }
            }
        };
    });
