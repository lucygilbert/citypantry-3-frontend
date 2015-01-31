angular.module('cp.factories').factory('OrdersFactory', function(API_BASE, ApiService) {
    return {
        getAllOrders: function() {
            return ApiService.get(`${API_BASE}/orders`);
        },
        getOrder: function(id) {
            return ApiService.get(`${API_BASE}/orders/${id}`);
        },
        deleteOrder: function(id) {
            return ApiService.delete(`${API_BASE}/order/${id}`);
        }
    };
});
