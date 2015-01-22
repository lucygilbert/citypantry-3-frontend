angular.module('cp', [
    'cp.controllers',
]);

angular.module('cp.controllers', [
    'cp.controllers.authentication',
    'cp.controllers.general',
]);

angular.module('cp').constant('API_BASE', window.location.protocol + '//api.' + window.location.host);
