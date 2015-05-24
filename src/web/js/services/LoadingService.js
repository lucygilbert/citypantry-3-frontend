angular.module('cp.services').service('LoadingService', function($document) {
    const animation = $document[0].querySelector('.state-loading');

    // There will be no animation if running Karma unit tests.
    if (!animation) {
        return {
            show: () => {},
            hide: () => {}
        };
    }

    return {
        show: () => animation.style.display = 'block',
        hide: () => animation.style.display = 'none'
    };
});
