angular.module('cp.factories', [
    'cp.filters'
]);

angular.module('cp.factories').factory('AddressFactory', function(ApiService, API_BASE) {
    return {
        getAddresses: () => ApiService.get(`${API_BASE}/addresses`),

        createAddress: (address) => ApiService.post(`${API_BASE}/addresses`, {address: address}),

        updateAddress: (id, updatedAddress) => ApiService.put(`${API_BASE}/addresses/${id}`, updatedAddress),

        deleteAddress: (id) => ApiService.delete(`${API_BASE}/addresses/${id}`)
    };
});
