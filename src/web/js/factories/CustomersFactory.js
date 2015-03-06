angular.module('cp.factories').factory('CustomersFactory', function(ApiService, API_BASE, $q) {
    return {
        getAllCustomers: () => ApiService.get(`${API_BASE}/customers`),

        getCustomer: id => ApiService.get(`${API_BASE}/customers/${id}`),

        updateCustomer: (id, updatedCustomer) => ApiService.put(`${API_BASE}/customers/${id}`, updatedCustomer),

        updateSelf: attributes => ApiService.put(`${API_BASE}/customers/self`, attributes),

        getAddresses: () => ApiService.get(`${API_BASE}/addresses`),

        getAddressById: (id) => {
            const deferred = $q.defer();

            ApiService.get(`${API_BASE}/addresses`).success(function(response) {
                const addresses = response.addresses;
                let address;
                for (let i = 0; i < addresses.length; i++) {
                    if (addresses[i].id === id) {
                        address = addresses[i];
                        break;
                    }
                }
                deferred.resolve(address);
            }).catch(function() {
                deferred.reject();
            });

            return deferred.promise;
        }
    };
});
