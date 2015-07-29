angular.module('cp.services').service('SecurityService', function($location, $cookies, $q,
        UsersFactory) {
    return {
        getUser() {
            const userIsLoggedInAndAvailable = this.isLoggedIn() && localStorage.getItem('user');
            return userIsLoggedInAndAvailable ? JSON.parse(localStorage.getItem('user')) : false;
        },

        getUserId() {
            const user = this.getUser();
            if (user) {
                return user.id;
            }
        },

        getVendor() {
            return UsersFactory.getLoggedInUser().then(function(response) {
                return response.data.vendor;
            });
        },

        getCustomer() {
            return UsersFactory.getLoggedInUser().then(function(response) {
                return response.data.customer;
            });
        },

        /**
         * Get whether the current user is in one of the given groups.
         *
         * @param  {String|Array} groups
         * @return {Boolean}
         */
        isInGroup(groups) {
            const user = this.getUser();
            if (!user || !user.group.name) {
                return false;
            }

            const userGroup = user.group.name.toLowerCase();

            if (groups.constructor === Array) {
                return groups.filter(group => group.toLowerCase() === userGroup).length > 0;
            } else {
                return groups.toLowerCase() === userGroup;
            }
        },

        isLoggedIn() {
            return !!$cookies.userId;
        },

        /**
         * Setting this property will cause the user to be redirected to the given URL after the
         * user authenticates (either via login or registration).
         */
        urlToForwardToAfterLogin: undefined,

        requireLoggedIn() {
            if (!this.isLoggedIn()) {
                this.urlToForwardToAfterLogin = $location.url();
                $location.url('/login');
            }
        },

        requireLoggedOut() {
            if (this.isLoggedIn()) {
                $location.path('/');
            }
        },

        requireStaff() {
            this.requireLoggedIn();

            if (!this.staffIsLoggedIn()) {
                $location.path('/');
            }
        },

        requireVendor() {
            this.requireLoggedIn();

            if (!this.vendorIsLoggedIn()) {
                $location.path('/');
            }
        },

        requireCustomer() {
            this.requireLoggedIn();

            if (!this.customerIsLoggedIn()) {
                $location.path('/');
            }
        },

        /**
         * @return {String} Either 'vendor', 'customer' or 'staff', or null.
         */
        getGroup() {
            const user = this.getUser(),
                parseGroup = (group) => (group === 'admin' || group === 'user') ? 'vendor' : group;

            if (user && user['group'] && user['group']['name']) {
                return parseGroup(this.getUser()['group']['name']);
            } else {
                return null;
            }
        },

        customerIsLoggedIn() {
            return this.getGroup() === 'customer';
        },

        staffIsLoggedIn() {
            return this.getGroup() === 'staff';
        },

        vendorIsLoggedIn() {
            return this.getGroup() === 'vendor';
        },

        /**
         * @return {String|false}
         */
        getStaffUserIdIfMasquerading() {
            // The value in 'staffMasqueraderId' will be a Mongo ID if the user is a masquerading
            // staff user. If it's anything else -- null, string 'null' (to delete the cookie via
            // Angular's $cookies) -- return false.
            if (typeof $cookies.staffMasqueraderId === 'string' &&
                    $cookies.staffMasqueraderId.length === 24) {
                return $cookies.staffMasqueraderId;
            }

            return false;
        }
    };
});
