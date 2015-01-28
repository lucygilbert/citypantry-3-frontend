angular.module('cp.factories').factory('PackagesFactory', function($http,
        API_BASE) {
    return {
        getAllPackages: function() {
            return $http.get(API_BASE + '/packages');
        },
        getPackage: function(id) {
            return $http.get(API_BASE + '/packages/' + id);
        }
    };
});
