angular.module('cp.services', []);

angular.module('cp.services').service('ApiService', function($http, $cookies) {
    function addAuthHeaders(config) {
        config = config || {};
        config.headers = config.headers || {};
        config.headers['X-CityPantry-UserId'] = $cookies.userId;
        config.headers['X-CityPantry-AuthToken'] = $cookies.salt;

        return config;
    }

    return {
        get: function(url, config) {
            config = addAuthHeaders(config);

            return $http.get(url, config);
        }
    };
});
