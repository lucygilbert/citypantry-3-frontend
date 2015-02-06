angular.module('cp.services').service('LoadingService', function($document) {
    const animation = $document[0].querySelector('.state-loading');

    return {
        show: () => animation.style.display = 'block',
        hide: () => animation.style.display = 'none'
    };
});
