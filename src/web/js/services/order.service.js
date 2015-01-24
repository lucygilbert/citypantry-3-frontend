(function() {
    angular
        .module('cp')
        .factory('orderService', orderService);
    
    orderService.$inject = ['$http', 'API_BASE'];
    
    function orderService($http, API_BASE) {
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
    }
})();
