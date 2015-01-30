angular.module('cp.factories').factory('PackagesFactory', function($http,
        API_BASE) {
    return {
        getAllPackages: function() {
            return $http.get(API_BASE + '/packages');
        },
        getPackage: function(id) {
            return $http.get(API_BASE + '/packages/' + id);
        },
        updatePackage: function(id, updatedPackage) {
            return $http.put(API_BASE + '/packages/' + id, updatedPackage);
        },
        deletePackage: function(id) {
            return $http.delete(API_BASE + '/packages/' + id);
        }
    };
});
