angular.module('cp.services').service('SecurityService', function($location, $cookies) {
    function isLoggedIn() {
        return !!$cookies.userId;
    }

    function getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    return {
        requireLoggedIn: function() {
            if (!isLoggedIn()) {
                $location.path('/login');
            }
        },

        requireLoggedOut: function() {
            if (isLoggedIn()) {
                $location.path('/');
            }
        },

        requireStaff: function() {
            if (!isLoggedIn() || getUser()['group']['name'] !== 'staff') {
                $location.path('/');
            }
        }
    };
});
