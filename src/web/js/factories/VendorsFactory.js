angular.module('cp.factories').factory('VendorsFactory', function(ApiService, API_BASE, $q) {
    return {
        getAllVendors: () => ApiService.get(`${API_BASE}/vendors`),

        getAllActiveAndApprovedVendors: () => ApiService.get(`${API_BASE}/vendors/all-active-and-approved`),

        getVendor: (idOrSlug) => ApiService.get(`${API_BASE}/vendors/${idOrSlug}`),

        getAddresses: () => ApiService.get(`${API_BASE}/addresses`),

        getAddressById: (id) => {
            const deferred = $q.defer();

            ApiService.get(`${API_BASE}/addresses`).success(function(response) {
                const addresses = response.addresses;
                let address;
                for (let i = 0; i < addresses.length; i++) {
                    if (addresses[i].id === id) {
                        address = addresses[i];
                    }
                }
                deferred.resolve(address);
            }).catch(function() {
                deferred.reject();
            });

            return deferred.promise;
        },

        getBusinessTypes: () => ApiService.get(`${API_BASE}/business-types`)
    };
});
