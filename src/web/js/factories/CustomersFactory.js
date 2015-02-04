angular.module('cp.factories', []);

angular.module('cp.factories').factory('CustomersFactory', function(ApiService, API_BASE) {
    return {
        getAllCustomers: function() {
            return ApiService.get(`${API_BASE}/customers`);
        },
        getCustomer: function(id) {
            return ApiService.get(`${API_BASE}/customers/${id}`);
        },
        updateCustomer: function(id, updatedCustomer) {
            return ApiService.put(`${API_BASE}/customers/${id}`, updatedCustomer);
        }
    };
});
