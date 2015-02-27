angular.module('cp.factories').factory('CustomersFactory', function(ApiService, API_BASE) {
    return {
        getAllCustomers: () => ApiService.get(`${API_BASE}/customers`),

        getCustomer: id => ApiService.get(`${API_BASE}/customers/${id}`),

        updateCustomer: (id, updatedCustomer) => ApiService.put(`${API_BASE}/customers/${id}`, updatedCustomer),

        updateSelf: attributes => ApiService.put(`${API_BASE}/customers/self`, attributes)
    };
});
