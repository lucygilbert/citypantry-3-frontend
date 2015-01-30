angular.module('cp.factories').factory('UsersFactory', function(ApiService, API_BASE) {
    return {
        getAllUsers: function() {
            return ApiService.get(API_BASE + '/users');
        }
    };
});
