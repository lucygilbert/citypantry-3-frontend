angular.module('cp.services').service('NotificationService', function($rootScope, LoadingService) {
    return {
        notifySuccess: function(message) {
            $rootScope.$broadcast('notify', {
                type: 'success',
                message: message
            });
        },
        notifyError: function(message = 'An unknown error occurred.') {
            $rootScope.$broadcast('notify', {
                type: 'error',
                message: message
            });
            LoadingService.hide();
        }
    };
});
