angular.module('cp.factories').factory('VendorsFactory', function(ApiService,
        API_BASE) {
    return {
        getAllVendors: function() {
            return ApiService.get(`${API_BASE}/vendors`);
        },
        getVendor: function(idOrSlug) {
            return ApiService.get(`${API_BASE}/vendors/${idOrSlug}`);
        },
        updateVendor: function(id, updatedVendor) {
            return ApiService.put(`${API_BASE}/vendors/${id}`, updatedVendor);
        },
        deleteVendor: function(id) {
            return ApiService.delete(`${API_BASE}/vendors/${id}`);
        }
    };
});
