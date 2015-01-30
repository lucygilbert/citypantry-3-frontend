angular.module('cp.services').service('NotificationService', function($window) {
    return {
        notifySuccess: function(message) {
            // @todo - improve this.
            $window.alert(message);
        },
        notifyError: function(message = 'An unknown error occurred.') {
            // @todo - improve this.
            $window.alert(message);
        }
    };
});
