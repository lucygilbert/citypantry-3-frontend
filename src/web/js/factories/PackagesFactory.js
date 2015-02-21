angular.module('cp.factories').factory('PackagesFactory', function(API_BASE, ApiService) {
    return {
        getAllPackages: function() {
            return ApiService.get(`${API_BASE}/packages`);
        },
        getPackage: function(id) {
            return ApiService.get(`${API_BASE}/packages/${id}`);
        },
        getPackageByHumanId: function(humanId) {
            return ApiService.get(`${API_BASE}/packages/${humanId}`);
        },
        updatePackage: function(id, updatedPackage) {
            return ApiService.put(`${API_BASE}/packages/${id}`, updatedPackage);
        },
        deletePackage: function(id) {
            return ApiService.delete(`${API_BASE}/packages/${id}`);
        },
        searchPackages: function(name = '', postcode = '', maxBudget = '') {
            const url = `${API_BASE}/packages/search?name=${name}&postcode=${postcode}` +
                `&maxBudget=${maxBudget}`;

            return ApiService.get(url);
        },
        getPackagesByVendor: function(id) {
            return ApiService.get(`${API_BASE}/packages/search/all?vendorId=${id}`);
        },
        getPackageReviews: id => ApiService.get(`${API_BASE}/reviews/package/${id}`)
    };
});
