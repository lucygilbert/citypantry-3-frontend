angular.module('cp').controller('NewsletterController', function($http,
        API_BASE, $window) {
    var vm = this;
    vm.subscribe = subscribe;
    
    function subscribe() {
        $http.post(API_BASE + '/newsletter/subscribe', {email: vm.email})
            .then(function(response) {
                vm.success = true;
            })
            .catch(function(response) {
                console.log('error', response);
            })
    }
});
