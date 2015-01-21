angular.module('cp.services.order', []);

angular.module('cp.services.order').factory('ordersFactory', function($http,
        API_BASE) {
    return {
        getAllOrders: function() {
            return $http.get(API_BASE + '/orders');
        },
        getOrder: function(id) {
            return $http.get(API_BASE + '/order/' + id);
        }
    };
});
