(function(angular) {

angular.module('angulartics.citypantry', ['angulartics'])
.config(['$analyticsProvider', function ($analyticsProvider) {
    function createSessionId() {
        var randomId = '';
        for (var i = 0; i < 20; i++) {
            randomId += Math.floor(Math.random() * 16).toString(16);
        }
        return randomId;
    }

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    const sessionId = createSessionId();

    $analyticsProvider.settings.trackRelativePath = true;

    $analyticsProvider.registerPageTrack(function (path) {
        const data = {
            'userId': window.userId,
            'sessionId': sessionId,
            'properties': {
                'path': path,
                'cpEventType': 'webAppPageView'
            }
        };
        $http.post(window.apiBase + '/reporting/event', data);
    });

    $analyticsProvider.registerEventTrack(function (action, properties) {
        const data = {
            'userId': window.userId,
            'sessionId': sessionId,
            'properties': angular.extend({
                'cpEventType': 'webAppClickEvent',
                'action': action
            }, properties)
        };
        $http.post(window.apiBase + '/reporting/event', data);
    });

}]);
})(angular);

