angular.module('cp', [
    'cp.controllers',
    'cp.filters',
    'cp.services',
]);

angular.module('cp.controllers', [
    'cp.controllers.admin',
    'cp.controllers.authentication',
    'cp.controllers.general',
]);

angular.module('cp.services', [
    'cp.services.order',
]);

angular.module('cp').constant('API_BASE', window.location.protocol + '//api.' + window.location.host);
