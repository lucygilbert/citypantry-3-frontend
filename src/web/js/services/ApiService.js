angular.module('cp.services', []);

angular.module('cp.services').service('ApiService', function($http, $cookies) {
    function addAuthHeaders(config = {}) {
        config.headers = config.headers || {};
        config.headers['X-CityPantry-UserId'] = $cookies.userId;
        config.headers['X-CityPantry-AuthToken'] = $cookies.salt;

        return config;
    }

    return {
        get: function(url, config) {
            config = addAuthHeaders(config);

            return $http.get(url, config);
        },

        post: function(url, data, config) {
            config = addAuthHeaders(config);

            return $http.post(url, data, config);
        },

        put: function(url, data, config) {
            config = addAuthHeaders(config);

            return $http.put(url, data, config);
        },

        'delete': function(url, config) {
            config = addAuthHeaders(config);

            return $http.delete(url, config);
        }
    };
});
