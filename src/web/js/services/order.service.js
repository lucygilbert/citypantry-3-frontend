angular.module('cp').factory('orderService', function($http, API_BASE) {
    return {
        getAllOrders: getAllOrders,
        getOrder: getOrder
    };
    
    function getAllOrders() {
        return $http.get(API_BASE + '/orders');
    }
    
    function getOrder(id) {
        return $http.get(API_BASE + '/order/' + id);
    }
});
