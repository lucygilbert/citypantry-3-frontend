angular.module('cp.services').service('SecurityService', function($location, $cookies) {
    return {
        getUser: function() {
            return (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : false;
        },

        inGroup: function(groups) {
            var userGroup = this.getUser()['group']['name'];
            if (!userGroup) {
                return false;
            }

            var result = false;

            if (groups.constructor === Array) {
                groups.forEach(group => {
                    if (group.toLowerCase() === userGroup.toLowerCase()) {
                        result = true;
                        return false;
                    }
                });
            } else {
                result = (groups.toLowerCase() === userGroup.toLowerCase());
            }

            return result;
        },

        isLoggedIn: function() {
            return !!$cookies.userId;
        },

        requireLoggedIn: function() {
            if (!this.isLoggedIn()) {
                $location.path('/login');
            }
        },

        requireLoggedOut: function() {
            if (this.isLoggedIn()) {
                $location.path('/');
            }
        },

        requireStaff: function() {
            if (!this.isLoggedIn() || this.getUser()['group']['name'] !== 'staff') {
                $location.path('/');
            }
        },

        requireVendor: function() {
            if (!this.isLoggedIn() || (!this.inGroup('admin') && !this.inGroup('user'))) {
                $location.path('/');
            }
        }
    };
});
