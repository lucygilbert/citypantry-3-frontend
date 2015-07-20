angular.module('cp.services').service('SecurityService', function($location, $cookies, $q, UsersFactory) {
    return {
        getUser: function() {
            var userIsLoggedInAndAvailable = this.isLoggedIn() && localStorage.getItem('user');
            return userIsLoggedInAndAvailable ? JSON.parse(localStorage.getItem('user')) : false;
        },

        getUserId: function() {
            const user = this.getUser();
            if (user) {
                return user.id;
            }
        },

        getVendor: function() {
            var deferred = $q.defer();

            UsersFactory.getLoggedInUser().success(function(loggedInUser) {
                deferred.resolve(loggedInUser.vendor);
            });

            return deferred.promise;
        },

        getCustomer: function() {
            return UsersFactory.getLoggedInUser().then(function(response) {
                return response.data.customer;
            });
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

        /**
         * Setting this property will cause the user to be redirected to the given URL after the
         * user authenticates (either via login or registration).
         */
        urlToForwardToAfterLogin: undefined,

        requireLoggedIn: function() {
            if (!this.isLoggedIn()) {
                this.urlToForwardToAfterLogin = $location.url();
                $location.url('/login');
            }
        },

        requireLoggedOut: function() {
            if (this.isLoggedIn()) {
                $location.path('/');
            }
        },

        requireStaff: function() {
            this.requireLoggedIn();

            if (!this.staffIsLoggedIn()) {
                $location.path('/');
            }
        },

        requireVendor: function() {
            this.requireLoggedIn();

            if (!this.vendorIsLoggedIn()) {
                $location.path('/');
            }
        },

        requireCustomer: function() {
            this.requireLoggedIn();

            if (!this.customerIsLoggedIn()) {
                $location.path('/');
            }
        },

        group: function() {
            var user = this.getUser(),
                parseGroup = (x) => x === 'admin' || x === 'user' ? 'vendor' : x;

            if (user && user['group'] && user['group']['name']) {
                return parseGroup(this.getUser()['group']['name']);
            } else {
                return '';
            }
        },

        customerIsLoggedIn: function() {
            return this.group() === 'customer';
        },

        staffIsLoggedIn: function() {
            return this.group() === 'staff';
        },

        vendorIsLoggedIn: function() {
            return this.group() === 'vendor';
        },

        /**
         * @return {String|false}
         */
        getStaffUserIdIfMasquerading: function() {
            // The value in 'staffMasqueraderId' will be a Mongo ID if the user is a masquerading
            // staff user. If it's anything else -- null, string 'null' (to delete the cookie via
            // Angular's $cookies) -- return false.
            if (typeof $cookies.staffMasqueraderId === 'string' &&
                    $cookies.staffMasqueraderId.length === 24) {
                return $cookies.staffMasqueraderId;
            }

            return false;
        },
    };
});
