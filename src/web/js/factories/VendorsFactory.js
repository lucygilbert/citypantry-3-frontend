angular.module('cp.factories').factory('VendorsFactory', function($http,
        API_BASE) {
    return {
        getAllVendors: function() {
            return $http.get(API_BASE + '/vendors');
        },
        getVendor: function(id) {
            return $http.get(API_BASE + '/vendors/' + id);
        }
    };
});
