angular.module('cp.factories').factory('PackagesFactory', function(API_BASE, ApiService) {
    return {
        getAllPackages: function() {
            return ApiService.get(`${API_BASE}/packages`);
        },
        getPackage: function(id) {
            return ApiService.get(`${API_BASE}/packages/${id}`);
        },
        updatePackage: function(id, updatedPackage) {
            return ApiService.put(`${API_BASE}/packages/${id}`, updatedPackage);
        },
        deletePackage: function(id) {
            return ApiService.delete(`${API_BASE}/packages/${id}`);
        }
    };
});
