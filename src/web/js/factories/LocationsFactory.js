angular.module('cp.factories').factory('LocationsFactory', function(ApiService, API_BASE) {
    return {
        getAddresses: () => ApiService.get(`${API_BASE}/addresses`),

        createAddress: (address) => ApiService.post(`${API_BASE}/addresses`, {address: address})
    };
});
