angular.module('cp.factories').factory('OrdersFactory', function(API_BASE, ApiService) {
    return {
        getAllOrders: function() {
            return ApiService.get(`${API_BASE}/orders`);
        },

        getOrdersByCurrentVendor: () => ApiService.get(`${API_BASE}/orders/by-current-vendor`),

        getOrder: function(id) {
            return ApiService.get(`${API_BASE}/orders/${id}`);
        },
        getOrderMessages: function(id) {
            return ApiService.get(`${API_BASE}/orders/${id}/messages`);
        },

        sendMessage: (id, message) => ApiService.put(`${API_BASE}/orders/${id}/messages`, {message: message}),

        updateOrder: function(id, updatedOrder) {
            return ApiService.put(`${API_BASE}/order/${id}`, updatedOrder);
        },

        deleteOrder: (id, reason = '') => ApiService.delete(`${API_BASE}/order/${id}?deletionReason=${reason}`),

        getCourierOrders: function() {
            return ApiService.get(`${API_BASE}/orders/courier`);
        },
        addCustomerServiceEvent: (id, event) => ApiService.post(`${API_BASE}/order/${id}/customer-service-events`, {event: event}),

        acceptOrder: (id) => ApiService.put(`${API_BASE}/order/${id}/accept`)
    };
});
