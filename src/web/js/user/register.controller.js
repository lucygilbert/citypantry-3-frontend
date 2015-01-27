angular.module('cp').controller('RegisterController', function($http, API_BASE,
        $cookies, $window) {
    var vm = this;
    vm.submit = submit;
    
    function submit() {
        vm.registerError = null;
        
        var registerDetails = {
            name: vm.name,
            email: vm.email,
            plainPassword: vm.plainPassword
        };
        
        $http.post(API_BASE + '/user/register', registerDetails)
            .then(function(response) {
                $cookies.userId = response.data.apiAuth.userId;
                $cookies.salt = response.data.apiAuth.salt;
                $window.localStorage.setItem('user',
                        JSON.stringify(response.data.user));
                $window.location = '/';
            })
            .catch(function(response) {
                vm.registerError = response.data.errorTranslation;
            })
    }
});
