angular.module('cp.services').service('AuthenticationService', function($cookies) {
    return {
        getUser: function() {
            return (localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : false;
        },

        inGroup: function(groups) {
            var userGroup = this.getUser()['group']['name'];
            if (!userGroup) {
                return false;
            }

            if (groups.constructor === Array) {
                groups.forEach(group => {
                    if (group.toLowerCase() === userGroup.toLowerCase()) {
                        return true;
                    }
                });
            } else {
                return (groups.toLowerCase() === userGroup.toLowerCase());
            }
        },

        isLoggedIn: function() {
            return !!$cookies.userId;
        }
    };
});
