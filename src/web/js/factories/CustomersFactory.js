angular.module('cp.factories').factory('CustomersFactory', function(ApiService, API_BASE, $q) {
    return {
        getAllCustomers: () => ApiService.get(`${API_BASE}/customers`),

        getCustomer: id => ApiService.get(`${API_BASE}/customers/${id}`),

        updateCustomer: (id, updatedCustomer) => ApiService.put(`${API_BASE}/customers/${id}`, updatedCustomer),

        updateSelf: attributes => ApiService.put(`${API_BASE}/customers/self`, attributes),

        getAddresses: () => ApiService.get(`${API_BASE}/addresses`),

        getAddressById: id => {
            const pluckMatchingAddress = response => {
                const allAddresses = response.data,
                    allIds = allAddresses.map(address => address.id),
                    address = allAddresses[allIds.indexOf(id)];

                if (address) {
                    return address;
                } else {
                    throw 'Couldn’t find address';
                }
            };

            return ApiService.get(`${API_BASE}/addresses`).then(pluckMatchingAddress);
        }
    };
});
