angular.module('cp.factories').factory('OrdersFactory', function(API_BASE, ApiService) {
    return {
        getAllOrders: function() {
            return ApiService.get(`${API_BASE}/orders`);
        },
        getOrder: function(id) {
            return ApiService.get(`${API_BASE}/orders/${id}`);
        },
        getOrderMessages: function(id) {
            return ApiService.get(`${API_BASE}/orders/${id}/messages`);
        },
        updateOrder: function(id, updatedOrder) {
            return ApiService.put(`${API_BASE}/orders/${id}`, updatedOrder);
        },
        deleteOrder: function(id) {
            return ApiService.delete(`${API_BASE}/order/${id}`);
        },
        getCourierOrders: function() {
            return ApiService.get(`${API_BASE}/orders/courier`);
        },
    };
});
