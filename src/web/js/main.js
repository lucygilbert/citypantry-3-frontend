angular.module('cp', [
    'cp.controllers',
]);

angular.module('cp.controllers', [
    'cp.controllers.authentication',
]);

angular.module('cp').constant('API_BASE', window.location.protocol + '//api.' + window.location.host);
