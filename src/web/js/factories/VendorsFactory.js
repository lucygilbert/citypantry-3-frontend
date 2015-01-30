angular.module('cp.factories').factory('VendorsFactory', function($http,
        API_BASE) {
    return {
        getAllVendors: function() {
            return $http.get(API_BASE + '/vendors');
        },
        getVendor: function(id) {
            return $http.get(API_BASE + '/vendors/' + id);
        },
        updateVendor: function(id, updatedVendor) {
            return $http.put(API_BASE + '/vendors/' + id, updatedVendor);
        },
        deleteVendor: function(id) {
            return $http.delete(API_BASE + '/vendors/' + id);
        }
    };
});
