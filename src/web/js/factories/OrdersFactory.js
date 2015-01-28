angular.module('cp.factories').factory('OrdersFactory', function($http,
        API_BASE) {
    return {
        getAllOrders: function() {
            return $http.get(API_BASE + '/orders');
        },
        getOrder: function(id) {
            return $http.get(API_BASE + '/orders/' + id);
        }
    };
});
