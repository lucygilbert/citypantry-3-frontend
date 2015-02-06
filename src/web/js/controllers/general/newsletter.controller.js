angular.module('cp.controllers.general', []);

angular.module('cp.controllers.general').controller('NewsletterController', function($http,
        API_BASE, $window) {
    function subscribe() {
        $http.post(API_BASE + '/newsletter/subscribe', {email: vm.email})
            .then(function(response) {
                vm.success = true;
            })
            .catch(function(response) {
                console.log('error', response);
            });
    }

    var vm = this;
    vm.subscribe = subscribe;
});
