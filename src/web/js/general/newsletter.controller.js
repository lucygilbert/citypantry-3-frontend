(function() {
    angular
        .module('cp')
        .controller('NewsletterController', NewsletterController);
    
    NewsletterController.$inject = ['$http', 'API_BASE', '$window'];
    
    function NewsletterController($http, API_BASE, $window) {
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
    }
})();
