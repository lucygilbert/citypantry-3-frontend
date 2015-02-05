angular.module('cp.factories').factory('VendorsFactory', function(ApiService,
        API_BASE) {
    return {
        getAllVendors: function() {
            return ApiService.get(`${API_BASE}/vendors`);
        },
        getAllActiveAndApprovedVendors: function() {
            return ApiService.get(`${API_BASE}/vendors/all-active-and-approved`);
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
