angular.module('cp.factories', []);

angular.module('cp.factories').factory('CustomersFactory', function($http,
        API_BASE) {
    return {
        getAllCustomers: function() {
            return $http.get(API_BASE + '/customers');
        },
        getCustomer: function(id) {
            return $http.get(API_BASE + '/customers/' + id);
        }
    };
});
