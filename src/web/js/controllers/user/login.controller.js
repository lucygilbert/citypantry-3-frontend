angular.module('cp.controllers.user', []);

angular.module('cp.controllers.user').controller('LoginController', function($http, API_BASE,
        $cookies, $window) {
    function submit() {
        vm.loginError = null;

        var loginDetails = {
            email: vm.email,
            plainPassword: vm.plainPassword
        };

        $http.post(API_BASE + '/user/login', loginDetails)
            .then(function(response) {
                $cookies.userId = response.data.apiAuth.userId;
                $cookies.salt = response.data.apiAuth.salt;
                $window.localStorage.setItem('user',
                        JSON.stringify(response.data.user));
                $window.location = '/';
            })
            .catch(function(response) {
                vm.loginError = response.data.errorTranslation;
            });
    }

    var vm = this;
    vm.submit = submit;
});
