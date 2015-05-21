(function(angular) {
'use strict';

/**
 * @ngdoc overview
 * @name angulartics.console
 * Dummy angulartics tracking provider for debugging
 */
angular.module('angulartics.console', ['angulartics'])
.config(['$analyticsProvider', function ($analyticsProvider) {

  $analyticsProvider.settings.trackRelativePath = true;

  $analyticsProvider.registerPageTrack(function (path) {
    window.console.group('Angulartics');
    window.console.info('pageTrack: ' + path);
    window.console.groupEnd();
  });

  $analyticsProvider.registerEventTrack(function (action, properties) {
      window.console.group('Angulartics');
      window.console.info('eventTrack: ' + action);
      window.console.info(properties);
      window.console.groupEnd();
  });

}]);
})(angular);


