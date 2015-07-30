angular.module('cp.services').service('NotificationService', function($rootScope, LoadingService,
        AngularticsAnalyticsService) {
    function onNotify(type, message) {
        $rootScope.$broadcast('notify', {
            type: type,
            message: message
        });

        AngularticsAnalyticsService.trackNotificationModal(type, message);
    }

    return {
        notifySuccess: function(message) {
            onNotify('success', message);
        },

        notifyError: function(message = 'An unknown error occurred.') {
            onNotify('error', message);
            LoadingService.hide();
        }
    };
});
