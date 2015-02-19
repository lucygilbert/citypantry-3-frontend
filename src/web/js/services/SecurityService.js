angular.module('cp.services').service('SecurityService', function($location, $cookies, $q, UsersFactory) {
    return {
        getUser: function() {
            return (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : false;
        },

        getVendor: function() {
            var deferred = $q.defer();

            UsersFactory.getLoggedInUser().then(function(loggedInUser) {
                deferred.resolve(loggedInUser.vendor);
            });

            return deferred.promise;
        },

        inGroup: function(groups) {
            var user = this.getUser();
            if (!user || !user.group.name) {
                return false;
            }

            var result = false;
            var userGroup = user.group.name;

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
            if (!this.isLoggedIn() || !this.inGroup(['admin', 'user'])) {
                $location.path('/');
            }
        }
    };
});
